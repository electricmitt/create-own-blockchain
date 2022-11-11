const SHA256 = require('crypto-js/sha256');
import Elliptic from 'elliptic';

const ec = new Elliptic.ec('secp256k1');

export default class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    // Calculate the hash in order to do the signature. This is needed because the hash value will be signed
    calculateHash() {

    }

    // Incoming Key
    signTransaction(signingKey) {
        // The miner transaction is valid
        if (this.fromAddress === null) return true;

        // Verify if the source account is the person's address, or more specifically, verify whether the source address is the
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('You cannot sign transactions for other wallets!');
        }
    }
}