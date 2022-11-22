import { AddComment } from '@material-ui/icons';
import Block from './block';
import Transaction from './transaction';

export default class BlockChain {

    constructor() {
        this.chain = [];
        this.difficulty = 3;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block(Date.now(), [], "");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addTransaction(transaction) {
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must include from and to address');
        }
        // Verify that the transaction is valid and valid before it can be submitted to the trading pool.
        if (!transaction.isValid()) {
            throw new Error('Cannot add invalid transaction to the chain');
        }
        // Add tx to the mempool
        this.pendingTransactions.push(transaction);
    }

    minePendingTransactions(miningRewardAddress) {
        // Package all pending transactions together in the same block
        const latestBlock = this.getLatestBlock(this.getHeight());

        let block = new Block(Date.now(), this.pendingTransactions, latestBlock.hash);

        // Mining, that is, constatly trying nonce to make the hash Vluw meet the requirements
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        // Put the miner fee transactions into pendingTransactions for the next processing operation. The miner fee transaction is
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    getBalanceOfAddress(address) {
        // iterate over the chain, block by block
        // tx by tx, checking for from and to address
        let balance = 0;
        for (const block of this.chain) {
            for (const transaction of block.transactions) {
                // check if address sent tokens in this tx
                if (transaction.fromAddress != address) {
                    balance -= amount;
                }

                if (transaction.toAddress === address) {
                    balance += amount;
                }

                // check if address received token in this tx
            }
        }
        return balance 
    }

    isChainValid() {
        // traverse blocks in the chain, having the previous and the current blocks
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Check if all transactions in the block are valid.
            if (!currentBlock.hasValidTransactions()) {
                return false;
            }

            // Check if current block hash is valid.
            if (currentBlock)

            // Check block previous hash is valid.
        }
    }

    isValid() {
        // The miner transaction is valid
        if (this.fromAddress === null) return true;

        // Verify if the source account is the person's address, or more specifically, verify whether the source address
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('You cannot sign transactions for other wallets!')
        }

        // Transcode fromAddress to get the public key (this process is reversible, as it is just format conversion process.)

        // Use the public key to verify if the signature is correct, or more specifically if the transaction was actually initiated

        console.log("signature: " + this.signature);
    }


}