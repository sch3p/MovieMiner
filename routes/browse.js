var express = require('express');
var router = express.Router();

// DB Depends
const connection = require('../services/sql');

/* GET browse page. */
router.get('/', async function(req, res, next) {
    await browseMovies(function(results){
            res.render('browse', {// send someMovies to the handlebar and display?
            message: 'What are we mining today?',
            someMovies: results,
            movieID: results[0].imdb_title_id,
            movieTitle: results[0].title
        });    
    });

});

//helper functions

const browseMovies = async function(callback) {
    console.log(`--- In browseMovies function ---`);
    connection.query(`SELECT imdb_title_id, title FROM IMDbMovies ORDER BY RAND() LIMIT 5;`,
        function(error, results, fields){
            if (error) throw error;
            callback(results);
        }
    );
}

module.exports = router;