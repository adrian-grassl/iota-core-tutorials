# Tokenless Data Notarization
- This tutorial shows how one can proof that a block was part of the past Tangle, even if this part of the Tangle was already pruned from network nodes

## User Story
- A **Prover** wants to prove to a **Verifier**, that a dataset/file was not altered since a specific time in the past by notarizing it
- A good example could be the government (**Verifier**) forcing companies (**Prover**) to write their daily CO2 emissions to the Tangle
- The government has no interest in providing storage for all the companies, but wants to receive veriably immutable data in the case of an audit, therefore all the data remains with the respective company until such an audit occurs

### Architecture
- This pattern does not rely on a Permanode storing the full Tangle history
- The party writing to the Tangle (**Prover**) is the same party reading from it, which allows reading a block by its block Id
- All a **Verifier** needs to verify this proof, is the chain of milestones back to the milestone that referenced this exact block
    - With Stardust each new milestone directly references the previous milestone
    - This creates a unique and verifiable chain of milestones in the Tangle
    - This means if the **Verifier's** notarization plugin didn't record the milestone history already it could even download the milestone chain from another source and verify its correctness before using it for further notarization verifications
- Since the pattern assumes trusted access to the network, it is strongly recommended that both the **Prover** and the **Verifier** operate their own network node and run the notarization plugin

![alt text](pattern.png)

### Steps
**Prover:**
- Attach dataset to the Tangle in a data block
- Wait for milestone confirmation of the block
- Fetch block together with notarization and store
- Provide notarized block to **Verifier**

**Verifier:**
- Receive notarized block from **Prover**
- Check validity of notarized block