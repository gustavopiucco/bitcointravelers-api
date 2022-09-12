const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

let mongodbOptions;

mongodbOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
    //ssl: true,
    //sslValidate: true, //necessario?
    //sslCA: fs.readFileSync(__dirname + '/../../certificates/rds-combined-ca-bundle.pem')
}

module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    mongodb: {
        url: process.env.MONGODB_URL,
        options: mongodbOptions,
    },
    general: {
        btctUsdPrice: 0.40,
        invoiceExpirationMinutes: 300
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: 10,
    },
    blockioApiKey: process.env.BLOCKIO_API_KEY,
    mailgun: {
        apikey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN
    },
}