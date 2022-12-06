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


async function sendNFT() {
    try {
        const { initLogger } = require('@iota/wallet');
        initLogger({
            name: './wallet.log',
            levelFilter: 'debug',
            targetExclusions: ["h2", "hyper", "rustls"]
        });
        
        const manager = new AccountManager({
            storagePath: `./${accountName}-database`,
        });
        await manager.setStrongholdPassword(password);
        const account = await manager.getAccount(accountName);

        await account.sync();

        // Send the full NFT output to the specified address
        const response = await account.sendNft([{
            //TODO: Replace with the address of your choice!
            address: 'rms1zrcrpf2le8mf808fgnuy87jsu0nhqu5w56d0zxdwgxc6sh3ks68kydvhpw6',
            //TODO: Replace with an NFT id from your account, you can mint one with `25-mint-nft.js`.
            nftId: '0x6b58221e71085ca7ae951a084efc855771ba27ef41cac253cfab39f9faa89bfa0000',
        }]);

        console.log(response);

    } catch (error) {
        console.log('Error: ', error);
    }
    process.exit(0);
}

sendNFT();