const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { commissionService } = require('../services');

const getCommissions = catchAsync(async (req, res) => {
    const commissions = await commissionService.getCommissions(req.params.userId);
    let commissionsArray = [];
    for (let commission of commissions) {
        commissionsArray.push({
            id: commission.id,
            userId: commission.userId,
            fromUserId: commission.fromUserId,
            level: commission.level,
            value: commission.value,
            createdAt: commission.createdAt
        });
    }
    res.status(httpStatus.OK).send(commissionsArray);
});

module.exports = {
    getCommissions,
};