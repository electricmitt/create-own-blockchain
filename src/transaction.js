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
        return SHA256(this.fromAddress + this.toAddress + this.amount);
    }

    // Incoming Key
    signTransaction(signingKey) {
        // The miner transaction is valid
        if (this.fromAddress === null) return true;

        // Verify if the source account is the person's address, or more specifically, verify whether the source address is the
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('You cannot sign transactions for other wallets!');
        }

        // Sign the transaction hash with the Private Key
        this.hash = this.calculateHash();

        const sign = signingKey.sign(this.hash, 'base64');

        // Convert the signature to the DER format.
        this.signature = sign.toDER('hex');

        console.log("signature: " + this.signature);
    }

    isValid() {
        // The miner transaction is valid
        if (this.fromAddress === null) return true;

        // Verify if the source account is the person's address, or more specifically, verify whether the source address
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('You cannot sign transactions for other wallets!')
        }

        // Transcode fromAddress to get the public key (this process is reversible, as it is just format conversion process.)
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');

        // Use the public key to verify if the signature is correct, or more specifically if the transaction was actually initiated
        console.log("signature: " + this.signature);

        return publicKey.verify(this.calculateHash(), this.signature);
    }
}