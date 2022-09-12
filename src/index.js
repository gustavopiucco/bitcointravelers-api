const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const app = require('./app');
const logger = require('./config/logger');
const config = require('./config/config');
const seed = require('./seed');
const { taskService } = require('./services');

let server;

(async () => {
    try {
        await mongoose.connect(config.mongodb.url, config.mongodb.options);
        logger.info('Connected to MongoDB');

        taskService.start();

        /* if (config.env === 'development') {
            mongoose.set('debug', true);
        } */

        await seed.seed(mongoose.connection.db);

        server = app.listen(config.port, () => logger.info(`Listening to port ${config.port}`));
    }
    catch (error) {
        logger.error(error);
    }
})();

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});