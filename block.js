//basically what a block looks like
const SHA256 = require('crypto-js/sha256');

export default class Block {
    constructor(timestamp, transactions, previousHash = ''){
        // The calculation of the hash must be at the end so to ensure that all data is assigned correctly before calculation.
        this.timestamp = timestamp; // a unique identifier for this block
        this.transactions = transactions; // transactions/data within the blockchain, transferring some coins
        this.previousHash = previousHash; // every block is changed together
        this.nonce = 0;
        this.hash = '';
    }

    calculateHash(){
        return SHA256(this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce);
    }

}