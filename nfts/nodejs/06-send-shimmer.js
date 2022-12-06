const { AccountManager } = require('@iota/wallet');


// Import password and seed phrase
require('dotenv').config({ path: './.env' });
const password = process.env.SH_PASSWORD;
const accountName = process.env.ACCOUNT_NAME;

// Network configuration
const { networkConfig } = require("./networkConfig.js");
const explorerURL = networkConfig.explorer;

// For better readability, some console output will be printed in a different color
const consoleColor = '\x1b[36m%s\x1b[0m';


async function run() {
    try {        
        const manager = new AccountManager({
            storagePath: `./${accountName}-database`,
        });
        await manager.setStrongholdPassword(password);
        const account = await manager.getAccount(accountName);

        await account.sync();

        //TODO: Replace with the address of your choice!
        const address =
            'rms1zzt0s3l6896a6hl5dh9k6upknsfs5p0u9p2fnyvj4zu8wdj4ysxpc0f0qyl';
        const amount = '100000';

        const response = await account.sendAmount([
            {
                address,
                amount,
            },
        ]);

        console.log(response);

    } catch (error) {
        console.log('Error: ', error);
    }
    process.exit(0);
}

run();