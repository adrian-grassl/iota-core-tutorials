const { SingleNodeClient, LocalPowProvider, sendData } = require('@iota/iota.js');
const fs = require('fs');
const fetch = require('node-fetch');

// Network configuration
const { networkConfig } = require("./networkConfig.js");
const nodeURL = networkConfig.node;
const explorerURL = networkConfig.explorer;


// For the sake of this tutorial, some console output will be printed in a different color for better readability
const consoleColor = '\x1b[36m%s\x1b[0m';


async function run() {
    // Setup client and define block content
    const client = new SingleNodeClient(nodeURL, { powProvider: new LocalPowProvider() });
    const tag = 'This is my Tag';
    const data = 'This is my data';

    // Attach block to Tangle and log explorer link
    const sendResult = await sendData(client, tag, data);
    const blockId = sendResult.blockId;
    console.log(consoleColor, 'Attached block:');
    console.log(explorerURL+"block/"+blockId, '\n');

    // Wait for block confirmation by milestone and read it with proof of inclusion from INX plugin
    const result = await getNotarization(client, nodeURL, blockId);
    
    // Store block with proof of inclusion in local json file
    if (result != false) {
        const filePath = `./notarized-block.json`;
        fs.writeFileSync(filePath, JSON.stringify(result, null, 4));
    
        console.log(consoleColor, 'Block successfully notarized and stored at:');
        console.log(filePath, '\n');
        
        console.log(consoleColor, 'Notarized block can now be handed over to the verifier');
    }
}

// Function which regularly checks for block confirmation and returns proof of inclusion if confirmed after n tries
async function getNotarization(client, nodeURL, blockId) {
    try {
        console.log(consoleColor, 'Wait for milestone confirmation to get notarized block:');

        let i = 0;
        while (i < 10) {
            i++;
            // Function waits for a certain time between iterations
            await sleep(1000);

            const blockMetadata = await client.blockMetadata(blockId);

            // If a block was referenced by a milestone the node will return its metadata with the key 'referencedByMilestoneIndex', otherwise the key won't be there
            if ('referencedByMilestoneIndex' in blockMetadata) {
                console.log(`Try ${i}: Block was referenced by milestone #${blockMetadata.referencedByMilestoneIndex}`, '\n');
                
                // Call "create" endpoint of PoI plugin with blockId and return the result
                const poiPluginUrl = `${nodeURL}/api/poi/v1/create/${blockId}`;
                const response = await fetch(poiPluginUrl);
                const result = await response.json();

                return result;

            } else {
                console.log(`Try ${i}: Block was not yet referenced by a milestone`);
            }
        }
        console.log(`Block was not referenced by a milestone after ${i} seconds.`);
        return false;

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