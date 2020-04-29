var express = require('express');
var router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user');
const Handlebars = require("handlebars");
// various spells to get movie info
const Movie = require('../models/Movie');
const UserActions = require('../models/userActions');

var expressHbs =  require('express-handlebars');


/* GET users listing. */
router.get('/', async function(req, res, next) {

  var hbs = expressHbs.create({});

  hbs.handlebars.registerHelper('grouped_each', function(every, context, options) {
    var out = "", subcontext = [], i;
    if (context && context.length > 0) {
        for (i = 0; i < context.length; i++) {
            if (i > 0 && i % every === 0) {
                out += options.fn(subcontext);
                subcontext = [];
            }
            subcontext.push(context[i]);
        }
        out += options.fn(subcontext);
    }
    return out;
  });

  if (req.isAuthenticated()) {
  
    var userID = req.user.id;
  
    const mined = await UserActions.getWatchLaterList(userID);

    var minedArray = mined.minedMovies;
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')

    

    var everything = await Movie.gatherPosters(minedArray);
    console.log(everything)
    niceUser = new User(req.user);
    console.log('--- Email: ' + req.user.emails[0].value + ' ---');
    res.render('user-profile', {
      user: niceUser,
      title: 'Movie Miner',
      minedMovies: everything
    });

  } else {
    res.render('user-noprofile', { title: 'Movie Miner' });
  }
});

/* GET login request */
// .get method has three parts: route, middleware, callback (optional)

router.get('/login',
 passport.authenticate('google', { scope: ['profile','email'] })
);

/* GET return request */
// .get method has three parts: route, middleware, callback (optional)

router.get('/return',
 //middleware
 passport.authenticate('google', { failureRedirect: './' }),
 //callback
 // What's going to happen when we have an authenticated user
 async function(req, res) {
   // See if the user is in our database
  var userExists = await User.checkUserExists(req.user.id);
  if (userExists == false) {
    var newUser = await User.addUser(req.user);
  }

  res.redirect('./');

 }
);



/* GET logout request. */
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/users');
});


/*
* PASSPORT HELPER METHODS
*/
/**
 * This function is called when the `passport.authenticate()` method is called.
 * 
 * If a user is found an validated, a callback is called (`callback(null, user)`) with the user
 * object.  The user object is then serialized with `passport.serializeUser()` and added to the 
 * `req.session.passport` object. 
 */
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // UNCOMMENT NEXT LINE TO REDIRECT IN LOCAL ENV
    callbackURL: 'http://localhost:8081/users/return'
    //callbackURL: 'https://cit412-movie-miner.ue.r.appspot.com/users/return'
  },
  function(accessToken, refreshToken, profile, callback) {
    // This will return the user's Google profile

    // The callback function has two parameters: an error, and a user object.  If there's no error, pass null as the first argument.
    return callback(null, profile);
  })
);

/**
 * This function is used in conjunction with the `passport.authenticate()` method.  See comments in
 * `passport.use()` above ^^ for explanation
 */
passport.serializeUser(function(user, callback) {
    callback(null, user);
});

/**
 * This function is used in conjunction with the `app.use(passport.session())` middleware defined below.
 * Scroll down and read the comments in the PASSPORT AUTHENTICATION section to learn how this works.
 * 
 * In summary, this method is "set" on the passport object and is passed the user ID stored in the `req.session.passport`
 * object later on.
 */
passport.deserializeUser(function(obj, callback) {
  callback(null, obj);
});




module.exports = router;