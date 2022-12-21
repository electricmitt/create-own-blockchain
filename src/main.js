const {Blockchain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const personalKey = ec.keyFromPrivate(
    'b96869e96eea7f882983022cf77b9c908d76662f2fe7cdc4fe5d5146edf3057e'
);

const personalWalletAddress = personalKey.getPublic('hex');

let misterchain = new Blockchain();

// Mine the first block
misterchain.minePendingTransactions(personalWalletAddress);

// This creates a transaction and signs it with our key
const tx1 = new Transaction(personalWalletAddress,
     ' 049628da01f64517db2835eda0e8f38b2f23be358ef9c7de8cc6180e0340f874490959eb1aa43fd930ae78b27a53ad10ce5d632d751fe8ec527b2f3d9c281636f3',
      100);
tx1.signTransaction(personalKey);
misterchain.addTransaction(tx1);

// Mines next block
misterchain.minePendingTransactions(personalWalletAddress);

// Creates a second transaction
const tx2 = new Transaction(personalWalletAddress, 'address1', 50);
tx2.signTransaction(personalKey);
misterchain.addTransaction(tx2);

// Mines next block
misterchain.minePendingTransactions(personalWalletAddress);

console.log();
console.log(
    `balance of Matthews wallet is ${misterchain.getBalanceOfAddress(personalWalletAddress)}`
);

// Another layer of validation and security
// misterchain.chain[1].transaction[0].amount = 10;

// Checks if the chain is valid
console.log();
console.log('is the Blockchain valid?', misterchain.isChainValid());