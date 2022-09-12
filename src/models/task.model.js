const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
    {
        payload: {
            type: Object,
            required: true
        },
        running: {
            type: Boolean,
            required: true,
            default: false
        },
        executeAt: {
            type: Date,
            required: true,
            default: Date.now()
        }
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
