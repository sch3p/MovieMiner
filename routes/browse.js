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

    if (req.isAuthenticated()) {
        var key = req.query.key;
        var poster = await Movie.fetchPoster(key);
        var userActions = await UserActions.getUserActions(key);
        console.log('--- URL found ---');
        console.log(poster);
        var reviews = userActions.Reviews;
        var ratings = userActions.Ratings;
        var uid = req.user.id;
        var avgRating = await UserActions.getAvgRating(key);
        var minedMoviesLength = await UserActions.getMinedMoviesLength(key);
        avgRating = avgRating.toFixed(1);

        console.log('--- checking if movie has been added ---')
        const mined = await UserActions.getMinedMovies(uid);
        var minedArray = mined.minedMovies;

        // returns bool based on if it exists
        var found = minedArray.some(function(array) {
            return array.imdb_title_id === key;
        });

        console.log('*************************************************')
        console.log(found);

        await Movie.viewSingleMovie(key, async function(results) {
            res.render('viewMovie', {
                alreadyAdded: found,
                theMovie: results,
                moviePoster: poster,
                key: key,
                reviews: reviews,
                ratings: ratings,
                avgRating: avgRating,
                minedMoviesLength : minedMoviesLength
            }); 
        })  
    } else {
        res.render('user-noprofile', { title: 'Movie Miner' });
    }  
});

router.post('/mineMovie', async function(req, res, next) {
    if (req.isAuthenticated()) {
        var username = req.user.displayName;
        var uid = req.user.id;
        var imdbId = req.body.mineMovieButton;

        const mined = await UserActions.getMinedMovies(uid);

        var minedArray = mined.minedMovies;

        console.log(minedArray)

        console.log('--- checking if movie has been added ---')

        // returns bool based on if it exists
        let found = minedArray.some(function(array) {
            return array.imdb_title_id === imdbId;
        })

        console.log('$$$$$$$$$$$$$$$$$$$$$')
        console.log(found)

        // check found
        if (found) {
            console.log('--- Movie already added, not adding ---');
            res.redirect(req.get('referer'));
        } else {
            await UserActions.mineMovies(imdbId, username, uid);
            res.redirect(req.get('referer'));
        }

    } else {
        res.render('user-noprofile', { title: 'Movie Miner' });
    }
});

router.post('/addReview', async function(req, res, next) {
    if (req.isAuthenticated()) {
        var username = req.user.displayName;
        var review = req.body.addReview;
        var rating = req.body.stars;
        console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
        console.log(rating)
        var imdbId = req.body.submitReview;
        await UserActions.addRating(imdbId, username, rating);
        await UserActions.addReview(imdbId, username, review);
        res.redirect(req.get('referer'));
    } else {
        res.render('user-noprofile', { title: 'Movie Miner' });
    }
});

// moved to save post as reviews

// router.post('/addRating', async function(req, res, next) {
//     if (req.isAuthenticated()) {
//         var username = req.user.displayName;
//         var rating = req.body.submitRating; //this will need a matching thing in viewMovie
//         await UserActions.addRating(imdbId, username, rating);
//         res.redirect(req.get('referer'));
//     } else {
//         res.render('user-noprofile', { title: 'Movie Miner' });
//     }
// });

module.exports = router;