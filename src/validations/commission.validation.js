const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getCommissions = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId).required(),
    }),
};

module.exports = {
    getCommissions
}