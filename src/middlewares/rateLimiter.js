const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { code: 429, message: 'Try again in 15 minutes' }
});

module.exports = {
    authLimiter,
};
