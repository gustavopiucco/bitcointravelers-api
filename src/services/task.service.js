const { User, Task, Invoice, Commission } = require('../models');
const userService = require('./user.service');
const blockioService = require('./blockio.service');
const { paymentStatus } = require('../config/payments');
const { taskTypes } = require('../config/tasks');
const moment = require('moment');
const logger = require('../config/logger');
const config = require('../config/config');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const start = async () => {
    /* if (config.env === 'development') {
        await User.updateMany({}, { btcBalance: 0, btctBalance: 0, careerPoints: 0 });
        logger.debug('btcBalance, btctBalance and careerPoints set to 0');
    } */

    while (true) {
        await sleep(5 * 1000);

        const task = await get();

        if (task) {
            switch (task.payload.taskType) {
                case taskTypes.WAITING_PAYMENT:
                    await runWaitingPayments(task);
            }
        }
    }
};

const add = async (payload) => {
    const task = await Task.create({ payload: payload });
    return task
};

const get = async () => {
    //get a task from the queue, set running = true and return it
    const task = await Task.findOneAndUpdate({ running: false, executeAt: { $lte: Date.now() } }, { running: true }).sort({ executeAt: 1 });
    if (task) {
        logger.debug('Get task ' + task.id);
    }
    return task;
};

const tryLater = async (taskId) => {
    //set executeAt to 60 seconds later to run this task later
    await Task.updateOne({ _id: taskId }, { running: false, executeAt: moment().add(60, 'seconds').toDate() });
    logger.debug('Trying later task ' + taskId);
}

const remove = async (taskId) => {
    //delete a task from queue
    await Task.deleteOne({ _id: taskId });
    logger.debug('Removed task ' + taskId);
}

const runWaitingPayments = async (task) => {
    const invoiceWaitingPayment = await Invoice.findOne({ _id: task.payload.invoiceId });

    //If invoice does not exists then delete the task (because user deleted the invoice)
    if (!invoiceWaitingPayment) {
        await remove({ _id: task.id });
        return;
    }

    //Check invoice expiration
    if (invoiceWaitingPayment.expires <= Date.now()) {
        await Invoice.updateOne({ _id: invoiceWaitingPayment.id }, { status: paymentStatus.EXPIRED });
        await remove({ _id: task.id });
        return;
    }

    //So invoice is waiting payment, then check available balance and process it
    const addressAvailableBalance = await blockioService.getAddressAvailableBalance(invoiceWaitingPayment.address);
    const invoicePriceTolerance = (invoiceWaitingPayment.price - (invoiceWaitingPayment.price * 0.05)); //-5% tolerance

    //se o valor de addressTotalReceived for maior ou igual ao valor q ele tem q pagar na fatura(menos 5% de tolerancia)
    if (addressAvailableBalance >= invoicePriceTolerance || config.env === 'development') {
        const networkReverse = await userService.getUserNetworkReverse(invoiceWaitingPayment.userId);

        //então pega os 100 niveis pra trás e paga as comissões direta e indireta
        for (let networkUser of networkReverse) {
            if (networkUser.level === 1) {
                const btcBalanceValue = (invoiceWaitingPayment.price * 0.05).toFixed(8); //5%
                const careerPointsValue = invoiceWaitingPayment.btctAmount / 2;
                await User.updateOne({ _id: networkUser.id }, { $inc: { btcBalance: btcBalanceValue, careerPoints: careerPointsValue } });
                await Commission.create({ userId: networkUser.id, fromUserId: invoiceWaitingPayment.userId, level: networkUser.level, value: btcBalanceValue });
            }
            else {
                const btcBalanceValue = (invoiceWaitingPayment.price * 0.0025).toFixed(8); //0.25%
                const careerPointsValue = invoiceWaitingPayment.btctAmount / 10;
                await User.updateOne({ _id: networkUser.id }, { $inc: { btcBalance: btcBalanceValue, careerPoints: careerPointsValue } });
                await Commission.create({ userId: networkUser.id, fromUserId: invoiceWaitingPayment.userId, level: networkUser.level, value: btcBalanceValue });
            }
        }

        //adiciona o saldo em btct pro usuario
        await User.updateOne({ _id: invoiceWaitingPayment.userId }, { $inc: { btctBalance: invoiceWaitingPayment.btctAmount } });
        //seta o status da fatura pra pagamento confirmado
        await Invoice.updateOne({ _id: invoiceWaitingPayment.id }, { status: paymentStatus.PAYMENT_CONFIRMED });
        //deleta a task
        await remove(task.id);
    }
    else {
        await tryLater(task.id);
    }
};

module.exports = {
    start,
    add
};

