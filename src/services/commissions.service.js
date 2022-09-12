const { Commission } = require('../models');

const getCommissions = async (userId) => {
    const commissions = await Commission.find({ userId: userId }).sort({ createdAt: -1 }).limit(5);

    return commissions;
};

module.exports = {
    getCommissions
};