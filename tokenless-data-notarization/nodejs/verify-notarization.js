const { serializeBlock } = require('@iota/iota.js');
const { Converter, WriteStream } = require('@iota/util.js');
const { Blake2b } = require('@iota/crypto.js');
const fs = require('fs');
const fetch = require('node-fetch')

// Network configuration
const { networkConfig } = require("./networkConfig.js");
const nodeURL = networkConfig.node;


// For the sake of this tutorial, some console output will be printed in a different color for better readability
const consoleColor = '\x1b[36m%s\x1b[0m';


async function run() {
    // Read and parse notarized block from file path
    const filePath = './notarized-block.json';
    const file = fs.readFileSync(filePath);
    const notarizedBlock = JSON.parse(file);
    console.log(consoleColor, 'Successfully imported notarized block from path:');
    console.log(filePath, '\n');

    // Generate blockID from block content
    // The blockID is defined as the BLAKE2b-256 hash of the entire serialized block
    const blockID = await blockIdFromBlock(notarizedBlock.block);
    console.log(consoleColor, 'BlockID of notarized block:');
    console.log(blockID, '\n');

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

// Returns the BLAKE2b-256 hash of the entire serialized block => blockId
async function blockIdFromBlock(block) {
    const writeStream = new WriteStream();
    
    serializeBlock(writeStream, block);

    const blockFinal = writeStream.finalBytes();
    const blockHash = Blake2b.sum256(blockFinal);

    const blockId = Converter.bytesToHex(blockHash, true);

    return blockId;
}

run().catch((err) => console.error(err));