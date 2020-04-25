// DB Depends
const connection = require('../services/sql');

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