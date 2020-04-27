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
    var results = await UserActions.getReviews(key);
    console.log('--- URL found ---');
    console.log(poster);
    var reviews = results.Reviews;
    var ratings = results.Ratings;
    console.log(reviews);
    console.log(ratings);
    await Movie.viewSingleMovie(key, function(results) {

        res.render('viewMovie', {
            theMovie: results,
            moviePoster: poster,
            key: key,
            reviews: reviews
        }); 

    });
});

module.exports = router;