const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const getUser = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.params.userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    res.send({
        id: user.id,
        role: user.role,
        sponsor: user.sponsor,
        name: user.name,
        username: user.username,
        email: user.email,
        btctBalance: user.btctBalance,
        btcBalance: user.btcBalance,
        careerPoints: user.careerPoints,
        createdAt: user.createdAt
    });
});

const getUserNetwork = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.params.userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    const network = await userService.getUserNetwork(req.params.userId);

    res.send(network);
});

const updateUser = catchAsync(async (req, res) => {
    const user = await userService.updateUserById(req.params.userId, req.body);

    res.send({
        name: user.name,
        username: user.username,
    });
});

const transferBtct = catchAsync(async (req, res) => {
    await userService.transferBtct(req.params.userId, req.params.userIdToTransfer, req.body.btctAmount);
    res.send();
});

module.exports = {
    getUser,
    getUserNetwork,
    updateUser,
    transferBtct
}