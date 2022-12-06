// Libraries
const fetch = require("node-fetch");

// Network configuration
const { networkConfig } = require("./networkConfig.js");
const faucetApi = networkConfig.faucetApi;


async function run() {
    const request = await requestFunds(faucetApi, 'rms1qqw2240snlkeygzzdl4hxunlmakueptyvhwg0evgf85vlcjg0mnczm2kp9m');
    console.log(request);
}

// Request tokens from faucet via API call
async function requestFunds(faucetUrl, addressBech32) {
    const requestFunds = await fetch(faucetUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ address: addressBech32 })
        });

    return await requestFunds.json();
}

run();