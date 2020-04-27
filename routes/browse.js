var express = require('express');
var router = express.Router();
// const omdb = require('omdb');
// const Handlebars = require("handlebars");

// DB Depends --> moved to Movie model
// const connection = require('../services/sql');

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
    console.log('--- URL found ---');
    console.log(poster);
    //await UserActions.getReviews(key);
    await Movie.viewSingleMovie(key, function(results) {

        res.render('viewMovie', {
            theMovie: results,
            moviePoster: poster,
            key: key
        }); 

    });
});

// testing functions
router.get('/test', async function(req, res, next) {
    var poster = await Movie.fetchPoster('tt0371746');
    
    res.render('test', {
        posterURL: poster
    })
})

//helper functions moved to Movie model

module.exports = router;