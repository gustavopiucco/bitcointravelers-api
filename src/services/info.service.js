const blockchainService = require('./blockchain.service');
const config = require('../config/config');

const getBTCTConversion = async (amount) => {
    const usdPrice = amount * config.general.btctUsdPrice;
    const btcPrice = await blockchainService.usdToBtc(usdPrice);
    const ethPrice = null;

    return { usdPrice, btcPrice, ethPrice }
};

module.exports = {
    getBTCTConversion
};