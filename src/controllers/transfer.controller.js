const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { transferService } = require('../services');

const getTransfers = catchAsync(async (req, res) => {
    const transfers = await transferService.getTransfers(req.params.userId);
    let transfersArray = [];
    for (let transfer of transfers) {
        transfersArray.push({
            id: transfer.id,
            userId: transfer.userId,
            toUserId: transfer.toUserId,
            btctAmount: transfer.btctAmount,
            createdAt: transfer.createdAt
        });
    }
    res.status(httpStatus.OK).send(transfersArray);
});

module.exports = {
    getTransfers,
};