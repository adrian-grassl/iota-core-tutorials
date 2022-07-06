### NodeJS Steps

**Prover:** Running ```node create-notarization.js``` will execute the following steps
- Attach dataset to the Tangle in a data block
- Wait for milestone confirmation of the block
- Fetch block together with notarization and store (Writes to file 'notarized-block.json')
- Provide notarized block to **Verifier**

**Verifier:** Running ```node verify-notarization.js``` will execute the following steps
- Receive notarized block from **Prover** (Reads from file 'notarized-block.json')
- Check validity of notarized block
