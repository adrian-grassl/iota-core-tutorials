/**
 * This example gets the balance for an account
 */

const { AccountManager } = require('@iota/wallet');

// Import password and seed phrase
require('dotenv').config({ path: './.env' });
const password = process.env.SH_PASSWORD;
const accountName = process.env.ACCOUNT_NAME;

// For better readability, some console output will be printed in a different color
const consoleColor = '\x1b[36m%s\x1b[0m';


async function run() {
    try {
        const manager = new AccountManager({
            storagePath: `./${accountName}-database`,
        });
        await manager.setStrongholdPassword(password);
    
        await balances(manager, accountName);
        await addresses(manager, accountName);

    } catch (error) {
        console.log('Error: ', error);
    }

    process.exit(0);
};

async function balances(manager, accountName) {
    try {
        const account = await manager.getAccount(accountName);

        // Always sync before calling getBalance()
        await account.sync();
        const balance = await account.getBalance();
        console.log(consoleColor, `${accountName}'s Balance:`);
	    console.log(balance, '\n');

    } catch (error) {
        console.log('Error: ', error);
    }
};

async function addresses(manager, accountName) {
    try {
        const account = await manager.getAccount(accountName);

        // Always sync before calling getBalance()
        await account.sync();
        const addresses = await account.addresses();
        console.log(consoleColor, `${accountName}'s Addresse(s):`);
	    console.log(addresses, '\n');

    } catch (error) {
        console.log('Error: ', error);
    }
};

run();