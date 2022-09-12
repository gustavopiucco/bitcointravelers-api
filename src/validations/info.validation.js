const Joi = require('joi');

const btctConversion = {
    query: Joi.object().keys({
        amount: Joi.number().required(),
    })
};

module.exports = {
    btctConversion
}