# Pattern: Tokenless Data Notarization
- This tutorial showcases the ability to proof the inclusion (Notarization) of a random dataset to the Tangle without the need to store data on it long term
- It describes the process of embedding a block in the immutable data structure of the Tangle, which allows to proof block content wasn’t altered at a later point in time

## Pattern Description
- A **Prover** wants to prove to a **Verifier**, that a dataset/file was not altered since a specific time in the past by notarizing the hash of it
- The party writing to the Tangle (**Prover**) is the same party reading from it, which allows reading a block by its block Id

### Architecture
![alt text](pattern.png)


### Stakeholder Infrastructure
#### Prover
- Operate a Shimmer or IOTA network node
- Activate the Notarization/Proof-of-Inclusion Plugin
#### Verifier
- Operate a Shimmer or IOTA network node
- Activate the Notarization/Proof-of-Inclusion Plugin

### Stakeholder Steps
#### Prover
Running ```node create-notarization.js``` will execute the following steps:
- Attach dataset to the Tangle in a data block
- Wait for milestone confirmation of the block
- Fetch block together with notarization and store (Write to file 'notarized-block.json')
- Provide notarized block to **Verifier**


#### Verifier
Running ```node verify-notarization.js``` will execute the following steps:
    - Receive notarized block from **Prover** (Read from file 'notarized-block.json')
    - Check validity of notarized block