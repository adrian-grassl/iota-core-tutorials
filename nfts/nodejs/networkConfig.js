var networkConfig = {};

// Private Tangle Network
// networkConfig.node = 'http://localhost:14265';
// networkConfig.faucet = 'http://localhost:8091';
// networkConfig.explorer = 'http://localhost:8082/dashboard/explorer/';

// Shimmer Beta Network
networkConfig.node = 'https://api.testnet.shimmer.network';
networkConfig.faucetWebsite = 'https://faucet.testnet.shimmer.network';
networkConfig.faucetApi = 'https://faucet.testnet.shimmer.network/api/enqueue';
networkConfig.explorer = 'https://explorer.shimmer.network/testnet';

// Alphanet Network
// networkConfig.node = 'https://api.alphanet.iotaledger.net';
// networkConfig.faucet = 'https://faucet.alphanet.iotaledger.net/';
// networkConfig.explorer = 'https://explorer.alphanet.iotaledger.net/alphanet';

// Shimmer
// networkConfig.node = 'https://api.shimmer.network/';
// networkConfig.explorer = 'https://explorer.shimmer.network/shimmer';

module.exports = { networkConfig };