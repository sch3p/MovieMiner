var express = require('express');
var router = express.Router();

// various spells to get movie info
const Movie = require('../models/Movie');

// DB Depends --> moved to model

/* GET home page. */
router.post('/', async (req, res, next) => {
    var key = req.body.search;

    try {
        await Movie.searchMovie(key, function(results) {
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
                    imdb_title_id: key
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

module.exports = router;