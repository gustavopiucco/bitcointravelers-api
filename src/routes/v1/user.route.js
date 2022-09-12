const express = require('express');
const validate = require('../../middlewares/validate');

const userValidation = require('../../validations/user.validation');
const invoiceValidation = require('../../validations/invoice.validation');
const commissionValidation = require('../../validations/commission.validation');
const transferValidation = require('../../validations/transfer.validation');

const userController = require('../../controllers/user.controller');
const invoiceController = require('../../controllers/invoice.controller');
const commissionController = require('../../controllers/commission.controller');
const transferController = require('../../controllers/transfer.controller');

const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/:userId')
    .get(auth(''), validate(userValidation.getUser), userController.getUser)
    .patch(auth(''), validate(userValidation.updateUser), userController.updateUser);

router.route('/:userId/network')
    .get(validate(userValidation.getUserNetwork), userController.getUserNetwork);

router.route('/:userId/invoices')
    .get(auth(''), validate(invoiceValidation.getInvoices), invoiceController.getInvoices)
    .post(auth(''), validate(invoiceValidation.createInvoice), invoiceController.createInvoice)

router.route('/:userId/invoices/:invoiceId')
    .delete(auth(''), validate(invoiceValidation.deleteInvoice), invoiceController.deleteInvoice);

router.route('/:userId/commissions')
    .get(auth(''), validate(commissionValidation.getCommissions), commissionController.getCommissions);

router.route('/:userId/transfers')
    .get(auth(''), validate(transferValidation.getTransfers), transferController.getTransfers);

router.route('/:userId/transfers/:userIdToTransfer')
    .post(auth(''), validate(transferValidation.transferBtct), userController.transferBtct);

module.exports = router;