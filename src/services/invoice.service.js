const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Invoice } = require('../models');
const blockchainService = require('./blockchain.service');
const blockioService = require('./blockio.service');
const taskService = require('./task.service');
const { paymentStatus } = require('../config/payments');
const { taskTypes } = require('../config/tasks');
const moment = require('moment');
const config = require('../config/config');

const getInvoices = async (userId) => {
    return await Invoice.find({ userId: userId });
};

const createInvoice = async (userId, invoice) => {
    //throw new ApiError(httpStatus.BAD_REQUEST, 'Disabled');
    if (await Invoice.findOne({ userId: userId, status: paymentStatus.WAITING_PAYMENT }).countDocuments() > 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'There is already an invoice waiting payment');
    }

    //Set invoice properties
    invoice.usdPrice = invoice.btctAmount * config.general.btctUsdPrice;
    invoice.expires = moment().add(config.general.invoiceExpirationMinutes, 'minutes').toDate();

    const [price, address] = await Promise.all([
        blockchainService.usdToBtc(invoice.usdPrice),
        blockioService.createAddress()
    ]);

    invoice.price = price;
    invoice.address = address;

    //Create invoice
    const createdInvoice = await Invoice.create({
        userId: userId,
        ...invoice
    });

    //Create task to process later
    await taskService.add({
        taskType: taskTypes.WAITING_PAYMENT,
        invoiceId: createdInvoice.id
    });

    return createdInvoice;
};

const deleteInvoice = async (invoiceId) => {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Disabled');
    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invoice not found');
    }

    if (invoice.status === paymentStatus.PAYMENT_CONFIRMED) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'You can not delete invoice that has payment confirmed');
    }

    await invoice.remove();
};

module.exports = {
    getInvoices,
    createInvoice,
    deleteInvoice
};