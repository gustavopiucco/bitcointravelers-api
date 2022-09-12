const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { infoService } = require('../services');

const btctConversion = catchAsync(async (req, res) => {
    const btctConversion = await infoService.getBTCTConversion(req.query.amount);
    res.status(httpStatus.OK).send(btctConversion);
});

module.exports = {
    btctConversion,
};