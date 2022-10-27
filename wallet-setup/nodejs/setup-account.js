/**
 * This example creates a new database and account
 */

// Libraries
const { AccountManager, CoinType } = require('@iota/wallet');

// Network configuration
const { networkConfig } = require('./networkConfig.js');
const nodeURL = networkConfig.node;

// Environment variables
require('dotenv').config({ path: './.env' });
const password = process.env.SH_PASSWORD;
const mnemonic = process.env.MNEMONIC;
const accountName = process.env.ACCOUNT_NAME;

// For better readability, some console output will be printed in a different color
const consoleColor = '\x1b[36m%s\x1b[0m';

async function run() {
    try {
      	// Define the account manager options with the imported network configuration and environment variables
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

      // Create a new account manager
      const manager = new AccountManager(accountManagerOptions);

      // Store your mnemonic seed phrase in Stronghold
      await manager.storeMnemonic(mnemonic);

      // Create a new account with your set account name
      const account = await manager.createAccount({
      alias: accountName,
      });
      console.log(consoleColor, `${accountName}'s account:`);
      console.log(account, '\n');

	  // Generate a new address for your account
		const address = await account.generateAddress();
		console.log(consoleColor, `${accountName}'s new address:`);
		console.log(address.address, '\n');
		
	} catch (error) {
		console.log('Error: ', error);
	}
	process.exit(0);
}

run();