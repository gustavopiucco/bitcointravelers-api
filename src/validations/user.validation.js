const Joi = require('joi');
const { objectId, password } = require('./custom.validation');

const getUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId).required(),
    }),
};

const getUserNetwork = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId).required(),
    }),
};

const updateUser = {
    params: Joi.object().keys({
        userId: Joi.required().custom(objectId).required(),
    }),
    body: Joi.object()
        .keys({
            username: Joi.string(),
            password: Joi.string().custom(password),
            name: Joi.string(),
        })
        .min(1),
};

module.exports = {
    getUser,
    getUserNetwork,
    updateUser
};
