const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON } = require('./plugins');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema({
    sponsor: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        require: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email');
            }
        }
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value) {
            if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                throw new Error('Password must contain at least one letter and one number');
            }
        },
        private: true
    },
    role: {
        type: String,
        enum: roles,
        default: 'user',
    },
    btctBalance: {
        type: Number,
        required: true,
        default: 0
    },
    btcBalance: {
        type: Number,
        required: true,
        default: 0
    },
    careerPoints: {
        type: Number,
        required: true,
        default: 0
    },
    /* activated: {
        type: Boolean,
        required: true,
        default: false
    } */
},
    {
        timestamps: true,
    });

//convert mongoose schema to JSON schema and removes __v, createdAt, updatedAt, and any path that has private: true
//it works hooking JSON.stringfy()
userSchema.plugin(toJSON);

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};

userSchema.statics.isUsernameTaken = async function (username, excludeUserId) {
    const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
    return !!user;
};

userSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

//execute before save document
userSchema.pre('save', async function (next) {
    const user = this;
    //if password field was modified then hash and set password hash
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;