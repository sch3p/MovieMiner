require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const mongo = require('./services/db');

/**
 * -------------- DECLARE ROUTERS ----------------
 */

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const browseRouter = require('./routes/browse');
const searchRouter = require('./routes/search');

/**
 * -------------- GENERAL SETUP ----------------
 */

const app = express();


/**
 * -------------- DATABASE ----------------
 */
async function startDB() {
  await mongo.init();
}
startDB();


/**
 * -------------- SESSION SETUP ----------------
 */

app.use(session({
  store: new MongoStore({
    url: process.env.MONGO_CONNECTION_STRING
  }),
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 * 2}
}));


/**
 * -------------- PASSPORT ----------------
 */

// MUST BE DONE AFTER THE EXPRESS SESSION IS ESTABLISHED
app.use(passport.initialize());
app.use(passport.session());


/**
 * -------------- VIEW ENGINE SETUP ----------------
 */

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


/**
 * -------------- MIDDLEWARE ----------------
 */

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * -- CUSTOM MIDDLEWARE FOR DETECTING LOGGED-IN USERS --
 */

app.use(function(req, res, next) {
  console.log('--- In locals middleware ---');
  res.locals.user = req.user;
  console.log('--- Auth status: ' + req.isAuthenticated() + ' ---');
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

/**
 * -------------- ROUTER MIDDLEWARE ----------------
 */

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/browse', browseRouter);

/**
 * -------------- ERROR HANDLING ----------------
 */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//comment

module.exports = app;