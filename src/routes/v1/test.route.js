const express = require('express');
const httpStatus = require('http-status');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = router;