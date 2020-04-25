var express = require('express');
var router = express.Router();
// const omdb = require('omdb');

// DB Depends --> moved to Movie model
// const connection = require('../services/sql');

// various spells to get movie info
const Movie = require('../models/Movie');

/* GET browse page. */
router.get('/', async function(req, res, next) {
    await Movie.browseMovies(function(results){
        // info from sql db
        // var movieID = results[0].imdb_title_id;
        // var movieTitle = results[0].title;

        console.log('IMDB id: ' + results[0].imdb_title_id);

        // get poster url
        var moviePosters = [];

        const putPosters = async () => {
            console.log('--- in putPosters function ---');
            
            for (var i = 0; i <= 5; ++i) {
                let id = results[i].imdb_title_id;
                console.log('--- Finding current ID ---');
                console.log(id);
                moviePosters[i] = await Movie.getMoviePoster(id);
                console.log('--- New poster added to array ---');
                // console.log(moviePosters[i]);
            }

            // var moviePoster = Movie.getMoviePoster(movieID);
            console.log('--- Found movie posters ---');
            console.log(moviePosters);
            return moviePosters;
        }

        putPosters();

        res.render('browse', {
            message: 'What are we mining today?',
            someMovies: results,
            somePosters: moviePosters
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