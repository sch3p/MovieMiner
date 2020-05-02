const dbService = require('../services/db');

class UserActions {

    constructor(review) {
        this.imdbId = review.imdbId;
        this.username = user.emails[0].value;
        this.review = review.reviewText;
    }

    static async getUserActions(key){
        console.log('--- In the getUserActions function ---');
        const result = await dbService.db.collection('userActions').findOne({imdbID: key});
        return result;
    }

    static async getAvgRating(key){
        console.log('--- In the getAvgRating function ---');
        const result = await dbService.db.collection('userActions').findOne({imdbID: key});
        var avgRating = 0;
        for (var i = 0; i < result.Ratings.length; i++){
            avgRating = avgRating + parseFloat(result.Ratings[i].rating);
        }
        avgRating = avgRating/(result.Ratings.length);
        return avgRating;
    }

    static async getWatchLaterList(userID){
        console.log('--- In the getWatchLater function ---');
        const result = await dbService.db.collection('userData').findOne({userID: userID});
        return result;
    }

    static async removeWatchLaterItem(userID, key) {
        console.log('--- In the removeWatchLaterItem function ---');
        try {
            await dbService.db.collection('userData').updateOne({userID: userID},
                {$pull:{minedMovies:{imdb_title_id: key}}}
            );
            console.log('--- User mined item: ', key, ' has been removed successfully ---');
            return true;
        } catch(err) {
            console.log('--- Error removing ID ', key, ' ---')
            console.log(err)
            return false;
        }
    }

    static async getWatchLaterLength(key){
        console.log('--- In the getWatchLater function ---');
        const result = await dbService.db.collection('userActions').findOne({imdbID: key});
        return result.MinedMovies.length;
    }

    static async addReview(key, displayName, review){
        console.log('--- In the addReview function ---');
        await dbService.db.collection('userActions').updateOne({imdbID: key},{$push:{"Reviews":{"Username":displayName, "review":review}}});
    }

    static async addRating(key, displayName, rating){
        console.log('--- In the addRating function ---');
        await dbService.db.collection('userActions').updateOne({imdbID: key},{$push:{"Ratings":{"Username":displayName, "rating":rating}}});
    }

    static async addToWatchLater(key, displayName, uid){
        console.log('--- In the addToWatchLater function ---');
        await dbService.db.collection('userActions').updateOne({imdbID: key},{$push:{MinedMovies:{Username:displayName}}});
        await dbService.db.collection('userData').updateOne({userID: uid},{$push:{minedMovies:{"imdb_title_id":key}}});
    }
}

module.exports = UserActions;