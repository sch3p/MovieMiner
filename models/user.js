const dbService = require('../services/db');

class User {
    constructor(userData) {
        this.id = userData.id;
        this.givenName = userData.name.givenName;
        this.familyName = userData.name.familyName;
        this.userImage = userData.photos[0].value;
        this.email = userData.emails[0].value;
    }

    static async addUser(userData) {
        console.log('--- In the addUser function ---');
        const newUser = await dbService.db.collection('users').insertOne(userData);

        let mineData = {
            userID: userData.id,
            minedMovies: []
        };

        await dbService.db.collection('userData').insertOne(mineData); 

        console.log('--- Finished the insertOne statement ---');
        console.log(JSON.stringify(newUser, null, 1));
        return newUser;
    }

    static async checkUserExists(userID) {
        console.log('--- In the checkUserExists function ---');
        const result = await dbService.db.collection('users').find({id: userID}).toArray();
        if (result.length > 0) {
            console.log('--- User exists.  Didn\'t create one. ---');
            return true;
        } else {
            console.log('--- User does NOT exist ---');
            return false;
        }
    }

    static async mineMovie(userID, key) {
        console.log('--- In the mineMovie function ---');
        const result = await dbService.db.collection('userData').find({})
    }
}

module.exports = User;