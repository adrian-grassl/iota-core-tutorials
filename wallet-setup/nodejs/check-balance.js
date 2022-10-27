// Libraries
const { AccountManager } = require('@iota/wallet');

// Environment variables
require('dotenv').config({ path: './.env' });
const password = process.env.SH_PASSWORD;
const accountName = process.env.ACCOUNT_NAME;

// For better readability, some console output will be printed in a different color
const consoleColor = '\x1b[36m%s\x1b[0m';

async function run() {
	try {
		// Create a new account manager from existing database path
		const manager = new AccountManager({
			storagePath: `./${accountName}-database`,
		});

		// Pass password to manager
		await manager.setStrongholdPassword(password);

		// Get specific account from account manager
		const account = await manager.getAccount(accountName);

        // Always sync before getting the account balance
		await account.sync();
		const balance = await account.getBalance();

		console.log(consoleColor, `${accountName}'s Balance:`);
		console.log(balance, '\n');

    } catch (error) {
        console.log('Error: ', error);
    }
    process.exit(0);
};

run();