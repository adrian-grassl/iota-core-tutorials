/**
 * This example creates a new database and account
 */

// Libraries
 const { AccountManager, CoinType } = require('@iota/wallet');
 
// Import password and seed phrase
require('dotenv').config({ path: './.env' });
const password = process.env.SH_PASSWORD;
const mnemonic = process.env.MNEMONIC;
const accountName = process.env.ACCOUNT_NAME;

// Network configuration
const { networkConfig } = require("./networkConfig.js");
const nodeURL = networkConfig.node;
const faucetWebsite = networkConfig.faucetWebsite;
const faucetApi = networkConfig.faucetApi;

// For better readability, some console output will be printed in a different color
const consoleColor = '\x1b[36m%s\x1b[0m';

async function main() {
	const accountManagerOptions = {
		storagePath: `./${accountName}-database`,
		clientOptions: {
			nodes: [nodeURL],
			localPow: true,},
		coinType: CoinType.Shimmer,
		secretManager: {
			Stronghold: {
				snapshotPath: `./wallet.stronghold`,
				password: `${password}`,
			},
		},
	};

	const manager = new AccountManager(accountManagerOptions);
	await manager.storeMnemonic(mnemonic);

	const account = await manager.createAccount({
		alias: accountName,
	});
	console.log(consoleColor, `${accountName}'s account:`);
	console.log(account, '\n');

	// Check balance of account
	// Always sync before calling getBalance()
	await account.sync();
	console.log(consoleColor, `${accountName}'s Balance:`);
	console.log(await account.getBalance(), '\n');
	
	// List addresses of account
	const addresses = await account.addresses();
	console.log(consoleColor, `${accountName}'s Addresse(s):`);
	console.log(addresses, '\n');

	// Use the Faucet to send testnet tokens to your address
	console.log(consoleColor, `Either request tokens via the faucet website:`);
	console.log(faucetWebsite, '\n');

	console.log(consoleColor, `Or request tokens programmatically via the faucet API:`);
	console.log(faucetApi, '\n');

	process.exit(0);
}

main();