// DB Depends
const connection = require('../services/sql');
// const omdb = require('omdb');
const omdb = new (require('omdbapi'))(process.env.OMDB_API_KEY);

class Movie {

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

    static async getMoviePoster(id) {
        console.log('--- in getMoviePoster function ---');

        // var posterURL = '';

        omdb.get({
            id: id
        }).then(res => {
            console.log('--- Response from OMDB ---');
            console.log(res);
            console.log(`--- Poster URL FOUND for ${id}---`);
            console.log(res.poster);
            return res.poster;
        }).catch(console.error);
    }

    static async putPosters(movieObjs) {
        // get poster url and put into array
        var moviePosters = [];

        console.log('--- in putPosters function ---');
            
        for (var i = 0; i <= 5; ++i) {
            let id = movieObjs[i].imdb_title_id;
            console.log('--- Finding current ID ---');
            console.log(id);
            let url = await Movie.getMoviePoster(id);
            console.log('--- URL got ---');
            console.log(url)
            moviePosters[i] = url;
            console.log('--- New poster added to array ---');
            // console.log(moviePosters[i]);
        }

        // var moviePoster = Movie.getMoviePoster(movieID);
        console.log('--- Found movie posters ---');
        console.log(moviePosters);
        return moviePosters;
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
        connection.query(`SELECT * FROM IMDbMovies where imdb_title_id LIKE '%${searchIn}%' OR title LIKE '%${searchIn}%' OR year LIKE '%${searchIn}%' OR genre LIKE '%${searchIn}%' OR country LIKE '%${searchIn}%' OR language LIKE '%${searchIn}%' OR director LIKE '%${searchIn}%' OR writer LIKE '%${searchIn}%' OR actors LIKE '%${searchIn}%' OR description LIKE '%${searchIn}%'`,
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