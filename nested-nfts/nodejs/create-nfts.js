// Libraries
const { utf8ToHex } = require('@iota/client');
const { AccountManager } = require('@iota/wallet');
const IPFS = require('ipfs-core');
const fs = require('fs');

// Environment variables
require('dotenv').config({ path: './.env' });
const password = process.env.SH_PASSWORD;
const accountName = process.env.ACCOUNT_NAME;

// Network configuration
const { networkConfig } = require('./networkConfig.js');
const { TIMEOUT } = require('dns');
const explorerURL = networkConfig.explorer;

// For better readability, some console output will be printed in a different color
const consoleColor = '\x1b[36m%s\x1b[0m';

// This function starts a local IPFS node for file upload
async function startIpfsNode() {
	console.log('\n');
	console.log(consoleColor, `Start local IPFS node for upload:`);
	
	let node = await IPFS.create({
		repo: `ipfs_node`,
	});

	return node;
}

// This function receives a running ipfs node instance and a file path for the upload
async function uploadToIPFS(ipfsNode, filePath) {
	try {  
		// Read file from path
		const file = fs.readFileSync(filePath);

		// Upload file to IPFS
		const fileAdded = await ipfsNode.add(file);
		const contentIdentifier = fileAdded.path;

		console.log('\n');
		console.log(
			consoleColor,
			`Your file "${filePath}" was successfully uploaded to IPFS:`,
		);
		console.log(`https://ipfs.io/ipfs/${contentIdentifier}`, '\n');

		return contentIdentifier;
	} catch (error) {
		console.error('IPFS upload error', error);
	}
}


// This function creates NFT metadata and mints a new NFT
async function mintNFT(itemName, ipfsCid, strongholdAccount) {
	// Define NFT metadata
	const metadataObject = {
		standard: "IRC27",
		type: "image/jpeg",
		version: "v1.0",
		name: `${itemName}`,
		uri: `https://ipfs.io/ipfs/${ipfsCid}`
	};

	const metadataBytes = utf8ToHex(JSON.stringify(metadataObject));

	const response = await strongholdAccount.mintNfts([
		{
			immutableMetadata: metadataBytes,
		}
	]);

	const transactionId = response.transactionId;
	console.log(consoleColor, `Wait for transaction confirmation:`);
	console.log(`${explorerURL}/transaction/${transactionId}`, '\n')

	// This makes sure the transaction, your NFT is minted in, is confirmed before you mint the next one
	if (await checkInclusion(strongholdAccount, transactionId, 20)) {
		console.log('\n');
		console.log(consoleColor, `Your NFT was successfully minted in this block:`);
		console.log(`${explorerURL}/block/${response.blockId}`, '\n')
	}
}


// This function receives a transaction ID and the number of seconds you want to wait for confirmation
// Returns 'true' when confirmed and 'false' when not confirmed within time period
async function checkInclusion(strongholdAccount, transactionId, seconds) {
	try {
		for (let i = 1; i <= seconds; i++) {
			strongholdAccount.sync();
			let transactionObject = await strongholdAccount.getTransaction(transactionId);
			console.log(`Transaction ${transactionObject.inclusionState}`);

			await new Promise(resolve => setTimeout(resolve, 1000));
			
			if (transactionObject.inclusionState === 'Confirmed') {
				return true;
			}
		}
		
		console.log(`Transaction was not confirmed within ${seconds} seconds.`)
		return false;

	} catch (error) {
		console.log('Error: ', error);
	}
}





// This function loads a stronghold account and triggers the IPFS upload as well as NFT minting process for a list of files
async function main() {
	try {
		const manager = new AccountManager({
			storagePath: `./${accountName}-database`,
		});
		await manager.setStrongholdPassword(password);
		const strongholdAccount = await manager.getAccount(accountName);

		await strongholdAccount.sync();

		const ipfsNode = await startIpfsNode();

		const items = ['avatar', 'mask', 'sword'];

		for (const item of items) {
			let cid = await uploadToIPFS(ipfsNode, `${item}.png`);
			await mintNFT(item, cid, strongholdAccount);
		}

	} catch (error) {
		console.log('Error: ', error);
	}
	process.exit(0);
}

main();