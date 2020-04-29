var express = require('express');
var router = express.Router();

// various spells to get movie info
const Movie = require('../models/Movie');
const UserActions = require('../models/userActions');

/* GET browse page. */
router.get('/', async function(req, res, next) {
    await Movie.browseMovies(async function(results){

        var everything = await Movie.gatherPosters(results);

        res.render('browse', {
            message: 'What are we mining today?',
            someMovies: everything,
        });    
    });
});

/* GET view a single movie page. */
router.get('/view', async function(req, res, next) {

    var key = req.query.key;
    var poster = await Movie.fetchPoster(key);
    var userActions = await UserActions.getUserActions(key);
    console.log('--- URL found ---');
    console.log(poster);
    var reviews = userActions.Reviews;
    var ratings = userActions.Ratings;
    //await UserActions.addReview(key,"movie_fanatick232", "wow this is an amazing movie, the weasels were very scary.");
    var avgRating = await UserActions.getAvgRating(key);

    avgRating = avgRating.toFixed(1);
    
    var document = await Movie.viewSingleMovie(key, function(results) {
        res.render('viewMovie', {
            theMovie: results,
            moviePoster: poster,
            key: key,
            reviews: reviews,
            ratings: ratings,
            avgRating: avgRating
        }); 
    });
});

router.post('/addWatchLater', async function(req, res, next) {
    var username = req.user.displayName;
    var imdbId = req.body.WatchLaterButton;
    res.redirect('/browse/view?key='+imdbId);
    await UserActions.addToWatchLater(imdbId, username);
});

module.exports = router;