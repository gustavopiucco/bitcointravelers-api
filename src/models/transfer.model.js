const mongoose = require('mongoose');

const transferSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        },
        toUserId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        },
        btctAmount: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

const Transfer = mongoose.model('Transfer', transferSchema);

module.exports = Transfer;
