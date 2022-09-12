const crypto = require('crypto');
const userModel = require('./models/user.model')

module.exports.seed = async (db) => {
    if (await db.collection('users').countDocuments() > 0) return;

    userModel.create({
        role: 'admin',
        //sponsor: '',
        name: 'Bitcoin Travelers',
        email: 'contact@bitcointravelers.com',
        username: 'bitcointravelers',
        password: crypto.randomBytes(20).toString('hex')
    });

}