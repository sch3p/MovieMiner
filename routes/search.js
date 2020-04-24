var express = require('express');
var router = express.Router();

// DB Depends
const connection = require('../services/sql');

/* GET home page. */
router.post('/', async (req, res, next) => {
    var key = req.body.campaign_input;
    res.redirect(`/campaigns/view?key=${key}`);
//     await searchMovie(req.body.inputSearch, function(results) {
//         res.status(200).send(results);
//     })
  //res.render('search');
});


router.get('/campaigns', async function(req, res, next) {
    res.sendStatus(200).send("hey");

});

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