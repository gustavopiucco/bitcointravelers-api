const BlockIo = require('block_io');
const config = require('../config/config');
const logger = require('../config/logger');
const { add } = require('../config/logger');
const blockio = new BlockIo(config.blockioApiKey);

const getBalance = async () => {
    let balance = await blockio.get_balance();
    return balance.data.available_balance;
};

const getAddressBalance = async (address) => {
    let balance = await blockio.get_address_balance({ address: address });
    return balance.data;
};

const getAddressAvailableBalance = async (address) => {
    let balance = await blockio.get_address_balance({ address: address });
    return parseFloat(balance.data.available_balance);
};

const getAddresses = async () => {
    let addresses = await blockio.get_my_addresses();

    return addresses.data.addresses;
};


const createAddress = async () => {
    let address = await blockio.get_new_address(); //get_new_address({label: 'label', address_type: 'WITNESS_V0 OR P2SH'})
    return address.data.address;
};

const archiveAddresses = async () => {
    const addresses = await getAddresses();

    for (let address of addresses) {
        if (address.label != 'default') {
            await blockio.archive_addresses({ address: address.address });
            logger.info(`Archived Address: ${address}`);
        }
    }
};

module.exports = {
    getBalance,
    getAddressBalance,
    getAddressAvailableBalance,
    getAddresses,
    createAddress,
    archiveAddresses
}