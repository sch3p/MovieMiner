var express = require('express');
var router = express.Router();
const omdb = require('omdb');

// DB Depends --> moved to Movie model
// const connection = require('../services/sql');

// various spells to get movie info
const Movie = require('../models/Movie');

/* GET browse page. */
router.get('/', async function(req, res, next) {
    await Movie.browseMovies(function(results){
        // info from sql db
        var movieID = results[0].imdb_title_id;
        var movieTitle = results[0].title;
        // get poster url
        // var moviePoster = await omdb.get(movieID, function(err, movie) {
        //     if(err) {
        //         return console.error(err);
        //     }

        //     if(!movie) {
        //         return console.log('--- Movie not found!');
        //     }

        //     console.log('--- OMDB GET RETURN ---');
        //     console.log(movie.poster);
        //     return movie.poster;
        // });

        res.render('browse', {
            message: 'What are we mining today?',
            someMovies: results,
            movieID: movieID,
            movieTitle: movieTitle,
            // moviePoster: omdb.poster(movieID)
        });    
    });
});

/* GET view a single movie page. */
router.get('/view', async function(req, res, next) {

    var key = req.query.key;

    await Movie.viewSingleMovie(key, function(results) {

        res.render('viewMovie', {
            theMovie: results
            // moviePoster: omdb.poster(movieID)
        }); 

    });
});

//helper functions moved to Movie model

module.exports = router;