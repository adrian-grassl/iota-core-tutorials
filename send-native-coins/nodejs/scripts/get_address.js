const {
    Client,
    CoinType,
    initLogger,
    SHIMMER_TESTNET_BECH32_HRP,
  } = require("@iota/client");

  // For the sake of this tutorial, some console output will be printed in a different color for better readability
  const blue = '\x1b[36m%s\x1b[0m';
  
  
  async function run() {
  
    const client = new Client({
      // Insert your node URL in the .env.
      nodes: ['https://api.testnet.shimmer.network'],
    });
  
    // You should only generate mnemonics for development or testing
    const mnemonic = await client.generateMnemonic();
    console.log(blue, 'Mnemonic:');
    console.log(mnemonic, '\n');
  
    const secretManager = {
      Mnemonic: mnemonic,
    };
  
    // Generate addresses with providing all inputs, that way it can also be done offline without a node.
    const offlineGeneratedAddresses = await client.generateAddresses(
      secretManager,
      {
        coinType: CoinType.Shimmer,
        accountIndex: 0,
        range: {
          start: 0,
          end: 1,
        },
        internal: false,
        // Generating addresses with client.generateAddresses(secretManager, {}), will by default get the bech32_hrp (Bech32
        // human readable part) from the nodeinfo, generating it "offline" requires setting it in the generateAddressesOptions
        bech32Hrp: SHIMMER_TESTNET_BECH32_HRP,
      }
    );
    console.log(blue, "Generated public address:");
    console.log(offlineGeneratedAddresses[0], '\n');
  }
  
  run().then(() => process.exit());