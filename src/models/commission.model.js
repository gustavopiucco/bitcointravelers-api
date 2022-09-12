const mongoose = require('mongoose');

const commissionSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        },
        fromUserId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        },
        level: {
            type: Number,
            required: true
        },
        value: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

const Commission = mongoose.model('Commission', commissionSchema);

module.exports = Commission;
