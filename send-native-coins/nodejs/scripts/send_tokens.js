const {
    Client,
  } = require("@iota/client");
  
const SEND_TO_ADDRESSS = "rms1qznwxgd9medd03ne7ydl083rgdrduadxv2d932w64zas94dlpc3ju7xvpqq"
const YOUR_MNEMONIC = "deputy cousin oxygen quiz also odor clever candy borrow know junk method logic alert give history toy dolphin enact shift tooth wreck verify evil"
// In this example we will send a transaction
async function run() {
    const client = new Client({
        // Insert your node URL in the .env.
        nodes: ['https://api.testnet.shimmer.network'],
        localPow: true,
      });


    try {
        
        const secretManager = {
            Mnemonic: YOUR_MNEMONIC,
        };

        // We prepare the transaction
        // Insert the output address and amount to spend. The amount cannot be zero.
        const blockIdAndBlock = await client.buildAndPostBlock(secretManager, {
            output: {
                address: SEND_TO_ADDRESSS,
                amount: '1000000',
            },
        });

        console.log(
            `Transaction sent: https://explorer.shimmer.network/testnet/block/${blockIdAndBlock[0]}`,
        );
    } catch (error) {
        console.error('Error: ', error);
    }
}

run().then(() => process.exit());