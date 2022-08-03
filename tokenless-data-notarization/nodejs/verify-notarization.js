const { TransactionHelper } = require('@iota/iota.js');
const fs = require('fs');
const fetch = require('node-fetch')

// Network configuration
const { networkConfig } = require("./networkConfig.js");
const nodeURL = networkConfig.node;
const explorerURL = networkConfig.explorer;


// For the sake of this tutorial, some console output will be printed in a different color for better readability
const consoleColor = '\x1b[36m%s\x1b[0m';


async function run() {
    // Read and parse notarized block from file path
    const filePath = './notarized-block.json';
    const file = fs.readFileSync(filePath);
    const notarizedBlock = JSON.parse(file);
    console.log(consoleColor, 'Successfully imported notarized block from path:');
    console.log(filePath, '\n');

    // Generate blockId from block content and log explorer link
    // The blockId is defined as the BLAKE2b-256 hash of the entire serialized block
    const blockId = TransactionHelper.calculateBlockId(notarizedBlock.block);
    console.log(consoleColor, 'Notarized block:');
    console.log(explorerURL+"block/"+blockId, '\n');

    // Verify provided notarization/proof of inclusion for block
    const validity = await verifyNotarization(nodeURL, notarizedBlock);
    console.log(consoleColor, 'Validity of provided notarization:');
    console.log(validity, '\n');
}

async function verifyNotarization(nodeURL, notarizedBlock) {
    // Call "validate" endpoint of PoI plugin with notarized block and return boolean answer
    const poiPluginUrl = `${nodeURL}/api/poi/v1/validate`;
    const response = await fetch(poiPluginUrl, {
        method: 'POST', 
        body: JSON.stringify(notarizedBlock),
        headers: { 'Content-Type': 'application/json' }
    })
    const result = await response.json();

    return result.valid;
}

run().catch((err) => console.error(err));