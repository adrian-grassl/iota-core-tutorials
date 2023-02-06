// Libraries
const fetch = require('node-fetch');

// Network configuration
const networkConfig = require('./networkConfig.js');
const faucetApi = networkConfig.faucetApi;

// For better readability, some console output will be printed in a different color
const consoleColor = '\x1b[36m%s\x1b[0m';

// Address to receive faucet tokens
const receivingAddress = 'rms1qr6typsk9crfdgqlsvqyulzuvg5pm8e56c92pma64fh7dle70kvq72wfpx6';

async function run() {
  const request = await requestFunds(faucetApi, receivingAddress);

  console.log(consoleColor, `Funds were requested from faucet:`);
  console.log(request, '\n');
}

// Request tokens from faucet via API call
async function requestFunds(faucetUrl, addressBech32) {
  const requestFunds = await fetch(faucetUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ address: addressBech32 }),
  });

  return await requestFunds.json();
}

run();