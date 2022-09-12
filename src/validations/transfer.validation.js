const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getTransfers = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId).required(),
    }),
};

const transferBtct = {
    params: Joi.object().keys({
        userId: Joi.required().custom(objectId).required(),
        userIdToTransfer: Joi.required().custom(objectId).required()
    }),
    body: Joi.object()
        .keys({
            btctAmount: Joi.number().integer().min(1).max(100000).required(),
        })
};

module.exports = {
    getTransfers,
    transferBtct
}