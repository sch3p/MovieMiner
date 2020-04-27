// DB Depends
const connection = require('../services/sql');

// OMDB API
const fetch = require("node-fetch");
const key = process.env.OMDB_API_KEY;

class Movie {

    static async fetchPoster(id) {
        console.log('--- in fetchPoster function ---')
        let url = `http://www.omdbapi.com/?apikey=${key}&i=${id}`;
        let response = await fetch(url);

        console.log(`--- Getting poster from ${url}`);

        var result = await response.json();
        
        // Replace with dummy poster if none found
        if (result.Poster == 'N/A') {
            result.Poster = '/images/not_found.png';
            return result.Poster;
        } else {
            return result.Poster;
        }
    }

    static async viewSingleMovie(id, callback) {
        console.log(`--- In viewSingleMovie function ---`);
        console.log(`--- Key found: ${id} ---`);
        connection.query(`SELECT * FROM IMDbMovies where imdb_title_id LIKE '%${id}%'`,
            function(error, results, fields){
                if (error) throw error;
                console.log('--- QUERY RESULT USING KEY ---');
                console.log(results);
                callback(results);
            }   
        );
    }

    static async gatherPosters(movieObjs) {

        console.log('--- in gatherPosters function ---');
        console.log(movieObjs);
        
        // get poster url and put into array
        // let moviePosters = [];
            
        for (var i = 0; i <= movieObjs.length-1; ++i) {
            let id = movieObjs[i].imdb_title_id;
            console.log('--- Finding current ID ---');
            console.log(id);
            let poster = await Movie.fetchPoster(id);
            console.log('--- URL Found ---');
            console.log(poster)
            // Add poster url to its array object
            // Replace with dummy poster if none found
            if (poster == 'N/A') {
                movieObjs[i].poster = '/images/not_found.png'
            } else {
                movieObjs[i].poster = poster;
            }
            console.log('--- New poster added to array ---');
            // console.log(moviePosters[i]);
        }

        console.log('--- Added movie posters result ---');
        console.log(movieObjs);
        return movieObjs;
    }

    static async browseMovies(callback) {
        console.log(`--- In browseMovies function ---`);
        connection.query(`SELECT imdb_title_id, title FROM IMDbMovies ORDER BY RAND() LIMIT 5;`,
            function(error, results, fields){
                if (error) throw error;
                console.log('--- QUERY RESULT ---');
                console.log(results);
                callback(results);
            }
        );
    }

    static async searchMovie(searchIn, callback) {
        console.log(`--- In searchMovie function ---`);
        console.log(`--- Search term found: ${searchIn} ---`)
        connection.query(`SELECT * FROM IMDbMovies where imdb_title_id LIKE '%${searchIn}%' OR title LIKE '%${searchIn}%' OR genre LIKE '%${searchIn}%' OR actors LIKE '%${searchIn}%'`,
            function(error, results, fields){
                if (error) throw error;
                console.log('--- QUERY RESULT ---');
                console.log(results);
                callback(results);
            }
        );
    }


}

module.exports = Movie;