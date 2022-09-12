const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const infoRoute = require('./info.route');
const testRoute = require('./test.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/info', infoRoute);
router.use('/test', testRoute);

module.exports = router;
