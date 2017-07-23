let mongodb = require('mongodb');
let MongoClient = require('mongodb').MongoClient;
let env = require('../config/env');
module.exports = {
    mongo5: async () => {
        const url = env.dbURI;
        try {
            let db = await MongoClient.connect(url);
            return {
                tasks: db.collection('tasks'),
                users: db.collection('users')
            };
        } catch (e) {
            console.error('Mongodb cannot connect to: '+url);
            return;
        }
    }
}
