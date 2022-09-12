const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { paymentType } = require('../config/payments');

const createInvoice = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        paymentType: Joi.string().required().valid(paymentType.BITCOIN, paymentType.ETHEREUM),
        btctAmount: Joi.number().integer().required().min(50).max(500000)
    }),
};

const getInvoices = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
};

const deleteInvoice = {
    params: Joi.object().keys({
        userId: Joi.string().required().custom(objectId),
        invoiceId: Joi.string().required().custom(objectId)
    }),
};

module.exports = {
    createInvoice,
    getInvoices,
    deleteInvoice
}