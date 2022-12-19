const {Blockchain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const personalKey = ec.keyFromPrivate(
    '145c34aae1ccadacecf6305ee422173c64aebee55ca94a46c63efc7e5a5a5c5b'
);

const personalWalletAddress = personalKey.getPublic('hex');

let misterChain = new Blockchain();

// Mine the first block
misterChain.minePendingTransactions(personalWalletAddress);

// This creates a transaction and signs it with our key
const tx1 = new Transaction(personalWalletAddress,
     '047d6e901dd689ea6928ec04a60974b3c086fb481de8f8c095019dd72eaad56115cb7646da8f88f88b9cc14d7e57eb9646c739f987af61d818e80bb617a8b32ab1',
      100);
tx1.signTransaction(personalKey);
misterChain.addTransaction(tx1);

// Mines next block
misterChain.minePendingTransactions(personalWalletAddress);

// Creates a second transaction
const tx2 = new Transaction(personalWalletAddress, 'address1', 50);
tx2.signTransaction(personalKey);
misterChain.addTransaction(tx2);

// Mines next block
misterChain.minePendingTransactions(personalWalletAddress);

console.log();
console.log(
    `balance of Matthews wallet is ${misterChain.getBalanceOfAddress(personalWalletAddress)}`
);

// Another layer of validation and security
// misterChain.chain[1].transaction[0].amount = 10;

// Checks if the chain is valid
console.log();
console.log('is the Blockchain valid?', misterChain.isChainValid());