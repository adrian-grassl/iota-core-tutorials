var networkConfig = {};

// Private Tangle Network
networkConfig.node = 'http://localhost:14265';
networkConfig.faucet = 'http://localhost:8091';
networkConfig.explorer = 'http://localhost:8082/dashboard/explorer/';


// Shimmer Beta Network
// networkConfig.node = 'https://api.testnet.shimmer.network';
// networkConfig.faucet = 'https://faucet.testnet.shimmer.network/api/enqueue';
// networkConfig.explorer = 'https://explorer.shimmer.network/testnet';

module.exports = { networkConfig };