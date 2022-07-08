const client = require("../config/config.js");


// Some console output will be printed in a different color for better readability
const consoleColor = '\x1b[36m%s\x1b[0m';

async function run() {
    // Fetch and log node status
    await client.ReadNodeStatus({}, function (error, answer) {
        if (error) {
            console.log(error);
        } else {
            console.log(consoleColor, 'Node Status');
            console.log(answer, '\n');
        }
    });
}


run().catch((err) => console.error(err));