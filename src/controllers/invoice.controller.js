const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { userService, invoiceService } = require('../services');

const getInvoices = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.params.userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    let invoicesArray = [];
    const invoices = await invoiceService.getInvoices(user.id);
    for (let invoice of invoices) {
        invoicesArray.push({
            id: invoice.id,
            userId: invoice.userId,
            status: invoice.status,
            btctAmount: invoice.btctAmount,
            usdPrice: invoice.usdPrice,
            price: invoice.price,
            expires: invoice.expires,
            address: invoice.address,
            createdAt: invoice.createdAt
        });
    }

    res.status(httpStatus.OK).send(invoicesArray);
});

const createInvoice = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.params.userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    const invoice = await invoiceService.createInvoice(user.id, req.body);
    res.status(httpStatus.CREATED).send({
        id: invoice.id,
        userId: invoice.userId,
        status: invoice.status,
        btctAmount: invoice.btctAmount,
        usdPrice: invoice.usdPrice,
        price: invoice.price,
        expires: invoice.expires,
        address: invoice.address,
        createdAt: invoice.createdAt
    });
});

const deleteInvoice = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.params.userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    await invoiceService.deleteInvoice(req.params.invoiceId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    getInvoices,
    createInvoice,
    deleteInvoice
};