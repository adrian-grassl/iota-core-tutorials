// Libraries
const { utf8ToHex } = require('@iota/client');
const { AccountManager } = require('@iota/wallet');
const IPFS = require('ipfs-core');
const fs = require('fs');

// Environment variables
require('dotenv').config({ path: './.env' });
const password = process.env.SH_PASSWORD;
const accountName = process.env.ACCOUNT_NAME;

// Network configuration
const networkConfig = require('./networkConfig.js');
const explorerURL = networkConfig.explorer;

// For better readability, some console output will be printed in a different color
const consoleColor = '\x1b[36m%s\x1b[0m';


async function uploadByPath(filePath) {
  try {
    console.log('\n');
    console.log(consoleColor, `Start local IPFS node for upload:`);

    // Set up local IPFS node for upload
    let node;
    if (!node) {
      node = await IPFS.create({
        repo: `ipfs_node`,
      });
    }

    // Read file from path
    const file = fs.readFileSync(filePath);

    // Upload file to IPFS
    const fileAdded = await node.add(file);
    const contentIdentifier = fileAdded.path;

    console.log('\n');
    console.log(
      consoleColor,
      `Your file was uploaded to IPFS with the following Content Identifier (CID):`,
    );
    console.log(contentIdentifier, '\n');

    console.log(consoleColor, `Check your file on IPFS:`);
    console.log(`https://ipfs.io/ipfs/${contentIdentifier}`, '\n');

    return contentIdentifier;
  } catch (error) {
    console.error('IPFS upload error', error);
  }
}

async function run() {
  try {
    const filePath = "nft-image.jpg";
    const ipfsCid = await uploadByPath(filePath);

    // Define NFT metadata
    const metadataObject = {
        standard: "IRC27",
        type: "image/jpeg",
        version: "v1.0",
        name: "<Enter_your_desired_name_here>",
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
        immutableMetadata: metadataBytes
      }
    ]);

    console.log(consoleColor, `Your NFT was successfully minted in this block:`);
    console.log(`${explorerURL}/block/${response.blockId}`, '\n')

  } catch (error) {
    console.log('Error: ', error);
  }
  process.exit(0);
}

run();