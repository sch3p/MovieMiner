var express = require('express');
var router = express.Router();

// DB Depends
const connection = require('../services/sql');

/* GET browse page. */
router.get('/', function(req, res, next) {
    res.render('browse', {
        message: 'What are we mining today?',
        clicked: 'You\'ve been warned.'
    });
});

router.get('/search', async (req, res, next) => {
    await searchMovie(req.body.inputSearch, function(results) {
        res.status(200).send(results);
    })
})

// helper functions

const searchMovie = async function(searchIn, callback) {
    console.log(`--- In searchMovie function ---`);
    connection.query(`SELECT imdb_title_id, title FROM IMDbMovies where title LIKE '%${searchIn}%' OR year LIKE '%${searchIn}%' OR genre LIKE '%${searchIn}%' OR country LIKE '%${searchIn}%' OR language LIKE '%${searchIn}%' OR director LIKE '%${searchIn}%' OR writer LIKE '%${searchIn}%' OR actors LIKE '%${searchIn}%' OR description LIKE '%${searchIn}%'`,
    function(error, results, fields) {
        if(error) throw error;
        callback(results);
    });
}

module.exports = router;