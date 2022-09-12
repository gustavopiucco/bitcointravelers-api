const httpStatus = require('http-status');
const { User, Transfer } = require('../models');
const ApiError = require('../utils/ApiError');

const createUser = async (userBody) => {
    const sponsor = await getUserByUsername(userBody.sponsor);
    if (!sponsor) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Sponsor does not exist');
    } else {
        userBody.sponsor = sponsor.id; //set userBody sponsor username to sponsor ObjectId to be able to store in schema ref
    }

    if (await User.isEmailTaken(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }

    if (await User.isUsernameTaken(userBody.username)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
    }

    const user = await User.create(userBody);
    return user;
};

const getUserById = async (id, fields = null) => {
    return User.findById(id, fields);
};

const getUserByEmail = async (email) => {
    return User.findOne({ email });
};

const getUserByUsername = async (username) => {
    return User.findOne({ username });
};

const getUserNetwork = async (userId) => {
    let arrNetwork = [];
    const directs = await User.find({ sponsor: userId }).select('name username');
    return directs;
};

const getUserNetworkReverse = async (userId) => {
    let arrNetwork = [];
    const user = await getUserById(userId);
    let lastUser = user;
    for (let level = 1; level <= 100; level++) {
        if (!lastUser.sponsor) break;

        let currentUser = await getUserById(lastUser.sponsor);
        arrNetwork.push({ id: currentUser.id, level: level });
        lastUser = currentUser;
    }
    return arrNetwork;
};

const updateUserById = async (userId, updateBody) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (updateBody.username && (await User.isUsernameTaken(updateBody.username, userId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
};

const transferBtct = async (userId, userIdToTransfer, btctAmount) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    const userToTransfer = await getUserById(userIdToTransfer);
    if (!userToTransfer) {
        throw new ApiError(httpStatus.NOT_FOUND, `The user to transfer does not exists`);
    }

    if (user.id === userToTransfer.id) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'You cannot transfer to yourself');
    }

    if (user.btctBalance < btctAmount) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient funds');
    }

    await User.updateOne({ _id: user.id }, { $inc: { btctBalance: -btctAmount } });
    await User.updateOne({ _id: userToTransfer.id }, { $inc: { btctBalance: btctAmount } });
    await Transfer.create({ userId: user.id, toUserId: userToTransfer.id, btctAmount: btctAmount });
};

module.exports = {
    createUser,
    getUserById,
    getUserByEmail,
    getUserByUsername,
    getUserNetwork,
    getUserNetworkReverse,
    updateUserById,
    transferBtct
};