const paymentType = {
    BITCOIN: 'bitcoin',
    ETHEREUM: 'ethereum',
};

const paymentStatus = {
    WAITING_PAYMENT: 'waiting_payment',
    PAYMENT_CONFIRMED: 'payment_confirmed',
    EXPIRED: 'expired',
};

module.exports = {
    paymentType,
    paymentStatus
};
