'use strict';
const {Blockchain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const personalKey = ec.keyFromPrivate(
    '4aad79fc342263689ed87256ced8e22383ecf6a525eba32d770651703750d8a7'
);

const personalWalletAddress = personalKey.getPublic('hex');

let misterChain = new Blockchain();

// Mine the first block
misterChain.minePendingTransactions(personalWalletAddress);

// This creates a transaction and signs it with our key
const tx1 = new Transaction(personalWalletAddress,
     '0432376afea9261b1bc59eaa9cba7742179d47af78bbf3cb54cf42914d79f0bab06a21303ef134187a74176d91a4aa5619f17997a57d0a361722e20a60c28dea74',
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
console.log('is the Blockchain valid?', misterChain.isChainValid() ? 'Yep' : 'Nope');