const {
    Client,
  } = require("@iota/client");
  
const YOUR_ADDRESSS = "rms1qrw5haz88q6x4japrlqm7tyywygc6swpjdc2hlqu5w0w8xtcew8e70r59zz"

// In this example we will get the outputs of an address that has no additional unlock
// conditions and sum the amounts and native tokens
async function run() {
    const client = new Client({
        // Insert your node URL in the .env.
        nodes: ['https://api.testnet.shimmer.network'],
      });
    
      try {
        // Get output ids of basic outputs that can be controlled by this address without further unlock constraints
        const outputIds = await client.basicOutputIds([
            { address: YOUR_ADDRESSS },
            { hasExpiration: false },
            { hasTimelock: false },
            { hasStorageDepositReturn: false },
        ]);

        // Get outputs by their IDs
        const addressOutputs = await client.getOutputs(outputIds);

        // Calculate the total amount and native tokens
        let totalAmount = 0;
        const totalNativeTokens = {};
        for (const outputResponse of addressOutputs) {
            const output = outputResponse['output'];
            totalAmount += parseInt(output.amount);
        }

        console.log(
            `Address Outputs have: ${totalAmount} glow.`
        );
    } catch (error) {
        console.log("Error: ", error)
    }
}

run().then(() => process.exit());