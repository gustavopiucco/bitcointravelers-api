const request = require('request-promise');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const btcToUsd = async (btcPrice) => {
    try {
        let oneDollarToBtc = await request.get('https://blockchain.info/tobtc?currency=USD&value=1');

        return (btcPrice / parseFloat(oneDollarToBtc)).toFixed(2);
    }
    catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'BTC conversor error')
    }
}

const usdToBtc = async (usdPrice) => {
    try {
        let btcPrice = await request.get(`https://blockchain.info/tobtc?currency=USD&value=${usdPrice}`);

        return parseFloat(btcPrice);
    }
    catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'BTC conversor error')
    }
};

module.exports = {
    btcToUsd,
    usdToBtc
}