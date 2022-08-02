const {
    SingleNodeClient,
    LocalPowProvider,
    sendData
} = require('@iota/iota.js');
const fs = require('fs');
const fetch = require('node-fetch');

const { networkConfig } = require("./networkConfig.js");
const nodeURL = networkConfig.node;
const explorerURL = networkConfig.explorer;


// Some console output will be printed in a different color for better readability
const consoleColor = '\x1b[36m%s\x1b[0m';


async function run() {

    const client = new SingleNodeClient(nodeURL, { powProvider: new LocalPowProvider() });
    const tag = 'This is my Tag';
    const data = 'This is my data';

    const sendResult = await sendData(client, tag, data);
    const blockId = sendResult.blockId;
    console.log(consoleColor, 'Attached Block ID:');
    console.log(blockId, '\n');

    const result = await getNotarization(client, nodeURL, blockId);

    const filePath = `./notarized-block.json`;
    fs.writeFileSync(filePath, JSON.stringify(result, null, 4));

    console.log(consoleColor, 'Block successfully notarized and stored at:');
    console.log(filePath, '\n');
    
    console.log(consoleColor, 'Notarized block can now be handed over to the verifier');
}

async function getNotarization(client, nodeURL, blockId) {
    try {
        console.log(consoleColor, 'Wait for milestone confirmation to get notarized block:');

        let i = 0;
        while (i <= 10) {
            i++;
            await sleep(1000);

            const blockMetadata = await client.blockMetadata(blockId);

            if ('referencedByMilestoneIndex' in blockMetadata) {
                console.log(`Try ${i}: Block was referenced by milestone #${blockMetadata.referencedByMilestoneIndex}`, '\n');
                
                const poiPluginUrl = `${nodeURL}/api/poi/v1/create/${blockId}`;
                
                const response = await fetch(poiPluginUrl);
                const result = await response.json();

                return result;

            } else {
                console.log(`Try ${i}: Block was not yet referenced by a milestone`);
            }
        }
        return('Not confirmed by a milestone after 10s');

    } catch (error) {
        console.log(error);
    }
};

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  } 

run().catch((err) => console.error(err));