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

    static async addReview(key, displayName, review){
        console.log('--- In the addReview function ---');
        await dbService.db.collection('userActions').updateOne({imdbID: key},{$push:{"Reviews":{"Username":displayName, "review":review}}});
    }

    static async addRating(key, displayName, rating){
        console.log('--- In the addReview function ---');
        await dbService.db.collection('userActions').updateOne({imdbID: key},{$push:{"Ratings":{"Username":displayName, "rating":rating}}});
    }

    static async addToWatchLater(key, displayName){
        console.log('--- In the addReview function ---');
        await dbService.db.collection('userActions').updateOne({imdbID: key},{$push:{"Watch Later":{"Username":displayName}}});
    }
}

module.exports = UserActions;