// Libraries
const { AccountManager } = require('@iota/wallet');

// Environment variables
require('dotenv').config({ path: './.env' });
const password = process.env.SH_PASSWORD;
const accountName = process.env.ACCOUNT_NAME;

// For better readability, some console output will be printed in a different color
const consoleColor = '\x1b[36m%s\x1b[0m';


// This function receives a stronghold account together with a NFT Id, which will be burned
async function burnNft(strongholdAccount, nftId) {
    await strongholdAccount.burnNft(nftId);
    await strongholdAccount.sync();

    console.log(consoleColor, `Nft successfully burned:`);
    console.log(nftId, '\n');
};


// The function lists all NFT's of a stronghold account and calls the burn NFT function for each of them
async function run() {
    try {

        const manager = new AccountManager({
            storagePath: `./${accountName}-database`,
        });
        await manager.setStrongholdPassword(password);
        const strongholdAccount = await manager.getAccount(accountName);
    
        await strongholdAccount.sync();

		const balance = await strongholdAccount.getBalance();
        const nftList = balance.nfts;

        if (nftList.length === 0) {
            console.log(consoleColor, `No Nft's in this account.`);
        } else {
            for (const nftId of nftList) {
                await burnNft(strongholdAccount, nftId);
            }
        }

    } catch (error) {
        console.log('Error: ', error);
    }
    process.exit(0);
}

run();