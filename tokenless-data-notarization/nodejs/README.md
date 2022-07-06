### NodeJS Steps

**Prover:**
```sh
$ node create-notarization.js
```
- Attach dataset to the Tangle in a data block
- Wait for milestone confirmation of the block
- Fetch block together with notarization and store (Writes to file 'notarized-block.json')
- Provide notarized block to **Verifier**

**Verifier:**
```sh
$ node verify-notarization.js
```
- Receive notarized block from **Prover** (Reads from file 'notarized-block.json')
- Check validity of notarized block
