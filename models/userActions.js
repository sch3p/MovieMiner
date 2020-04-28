const dbService = require('../services/db');

class UserActions {

    constructor(review) {
        this.imdbId = review.imdbId;
        this.username = user.emails[0].value;
        this.review = review.reviewText;
    }

    // static async addReview(review) {
    //     console.log('--- In the addReview function ---');
    //     //db.userActions.update({"imdbID":"tt0160182"}, {$push:{"Reviews":{"Username":"JOECOOL", "review":"very COOL"}}})
    //     var newvalues = { $set: {name: "Mickey", address: "Canyon 123" } };
    //     dbo.collection("customers").updateOne(review.imdbId, newvalues, function(err, res) {
    //         if (err) throw err;
    //         console.log("1 document updated");
    //         db.close();
    //     });
    //     const newReview = await dbService.db.collection('userActions').updateOne;
    //     console.log('--- Finished the updateOne statement ---');
    //     console.log(JSON.stringify(review, null, 1));
    //     return review;
    // }

    static async getUserActions(key){
        console.log('--- In the getUserActions function ---');
        console.log(key);
        const result = await dbService.db.collection('userActions').findOne({imdbID: key});
        return result;
    }
}

module.exports = UserActions;