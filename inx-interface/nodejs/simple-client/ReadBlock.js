const client = require("../config/config.js");


// Some console output will be printed in a different color for better readability
const consoleColor = '\x1b[36m%s\x1b[0m';

async function run() {    
    // Fetch and log a random tip
    const TipsRequest = { count: 1, allowSemiLazy: false };

    const tipBlockId = await new Promise((resolve, reject) => {
        client.RequestTips(TipsRequest, function (error, answer) {
            if (error) {
                reject(error);
            } else {
                console.log(consoleColor, 'Random tip');
                console.log(answer, '\n');

                const blockId = answer.tips[0].id.toString('hex');
                resolve(blockId);
            }
        });
    })
    
    // Fetch and log block of previously fetched tip
    const blockIdBuff = Buffer.from(tipBlockId.toString(), "hex");
    const blockId = { id: blockIdBuff };

    await client.ReadBlock(blockId, function (error, answer) {
        if (error) {
            console.log(error);
        } else {
            console.log(consoleColor, 'Block of random tip');
            console.log(answer, '\n');
        }
    });
}


run().catch((err) => console.error(err));