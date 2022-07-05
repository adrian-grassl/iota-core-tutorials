const { nodeURL } = require('./config.js');
const fs = require('fs');
const fetch = require('node-fetch')


// Some console output will be printed in a different color for better readability
const consoleColor = '\x1b[36m%s\x1b[0m';


async function run() {
    const filePath = './notarized-block.json';
    const file = fs.readFileSync(filePath);
    const notarizedBlock = JSON.parse(file);
    console.log(consoleColor, 'Successfully imported notarized block from path:');
    console.log(filePath, '\n');

    const validity = await verifyNotarization(nodeURL, notarizedBlock);
    console.log(consoleColor, 'Validity of provided notarization:');
    console.log(validity, '\n');
}

async function verifyNotarization(nodeURL, notarizedBlock) {
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