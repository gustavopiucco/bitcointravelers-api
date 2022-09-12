const { Transfer } = require('../models');

const getTransfers = async (userId) => {
    const transfers = await Transfer.find({ userId: userId }).sort({ createdAt: -1 }).limit(20);

    return transfers;
};

module.exports = {
    getTransfers
};