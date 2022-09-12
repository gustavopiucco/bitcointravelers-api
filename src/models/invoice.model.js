const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { paymentType, paymentStatus } = require('../config/payments')

const invoiceSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: [paymentStatus.WAITING_PAYMENT, paymentStatus.PAYMENT_CONFIRMED, paymentStatus.EXPIRED],
            required: true,
            default: paymentStatus.WAITING_PAYMENT
        },
        paymentType: {
            type: String,
            enum: [paymentType.BITCOIN],
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        address: {
            type: String
        },
        usdPrice: {
            type: Number,
            required: true,
        },
        btctAmount: {
            type: Number,
            required: true
        },
        expires: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true,
    });

invoiceSchema.plugin(toJSON);

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;