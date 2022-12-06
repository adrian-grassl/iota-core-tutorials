/**
 * This example will mint an NFT
 */
const { utf8ToHex, hexToUtf8 } = require('@iota/client');
const { uploadByPath } = require('./ipfs');
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
        const filePath = "long-live-arty.jpg";
        const ipfsCid = await uploadByPath(filePath);

        // Define NFT metadata
        const metadataObject = {
            standard: "IRC27",
            type: "image/jpeg",
            version: "v1.0",
            name: "Long Live Arty!",
            uri: `https://ipfs.io/ipfs/${ipfsCid}`
        };

        const metadataBytes = utf8ToHex(JSON.stringify(metadataObject));

        const manager = new AccountManager({
            storagePath: `./${accountName}-database`,
        });
        await manager.setStrongholdPassword(password);
        const account = await manager.getAccount(accountName);
        
        await account.sync();

        const response = await account.mintNfts([
            {
                //address: 'rms1zrjk3l30ma6s4j2wch5nx6c7v4edfxqrhhqzrvmmms7layxjel4h7n7tt4x',
                //issuer: 'rms1zz9gvhjl9sy9haaqn4h8n2rsphq0eauazm6el7akda6sx47xvgsk53ulr3g',
                //sender: 'rms1qp2j7aenpjwzmwl9ns2f0742v4fqmutfzmzx0v0c5vugafkwls30q37wk0r',
                immutableMetadata: metadataBytes,
            }
        ]);

        console.log(consoleColor, `Check your block on the explorer:`);
        console.log(`${explorerURL}/block/${response.blockId}`, '\n')
    } catch (error) {
        console.log('Error: ', error);
    }
    process.exit(0);
}

run();