const express = require('express');
const validate = require('../../middlewares/validate');
const infoValidation = require('../../validations/info.validation');
const { infoController } = require('../../controllers');

const router = express.Router();

router.route('/btct')
    .get(validate(infoValidation.btctConversion), infoController.btctConversion);

module.exports = router;