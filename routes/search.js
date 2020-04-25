var express = require('express');
var router = express.Router();

// various spells to get movie info
const Movie = require('../models/Movie');

// DB Depends --> moved to model
// const connection = require('../services/sql');

/* GET home page. */
router.post('/', async (req, res, next) => {
    var key = req.body.campaign_input;

    try {
        await Movie.searchMovie(key, function(results) {
            // console.log('--- Query Results ---')
            // console.log(results);
            // Render based on how many were found on search
            if (results.length == 0) {
                console.log('--- No movies found on search ---');
                res.render('oopsie', {
                    message: "Maybe try using a different pickaxe."
                });
            } else if (results.length == 1) {
                res.redirect(`./browse/view?key=${results[0].imdb_title_id}`);
            } else {
                res.render(`search`, {
                    theMovie: results,
                    imdb_title_id: key,
                    // title: results[0].title,
                    // year: results[0].year,
                    // genre: results[0].genre,
                    // duration: results[0].duration,
                    // country: results[0].country,
                    // language: results[0].language,
                    // director: results[0].director,
                    // writer: results[0].writer,
                    // actors: results[0].actors,
                    // description: results[0].description
                });
            }
    
        });
    } catch (err) {
        res.render('oopsie', {
            message: "Pickaxe broke, lore found below:",
            errMesg: err.message
        });
    }
});

// helper functions

// const searchMovie = async function(searchIn, callback) {
//     console.log(`--- In searchMovie function ---`);
//     connection.query(`SELECT * FROM IMDbMovies where title LIKE '%${searchIn}%' OR year LIKE '%${searchIn}%' OR genre LIKE '%${searchIn}%' OR country LIKE '%${searchIn}%' OR language LIKE '%${searchIn}%' OR director LIKE '%${searchIn}%' OR writer LIKE '%${searchIn}%' OR actors LIKE '%${searchIn}%' OR description LIKE '%${searchIn}%'`,
//     function(error, results, fields) {
//         if(error) throw error;
//         callback(results);
//     });
// }

module.exports = router;