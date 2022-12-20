const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');



class Block {
    constructor(timestamp, transactions, previousHash = ''){
        // The calculation of the hash must be at the end so to ensure that all data is assigned correctly before calculation.
        this.timestamp = timestamp; // a unique identifier for this block
        this.transactions = transactions; // transactions/data within the blockchain, transferring some coins
        this.previousHash = previousHash; // every block is changed together
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto.createHash('sha256').update(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).digest('hex');
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("BLOCK MINED, nonce: " + this.nonce + ", hash: " + this.hash);
    }

    hasValidTransactions() {
        for (const tx of this.transactions) {
            if (!tx.isValid()) {
                return false;
            }
        }

        return true;
    }
}

class Blockchain {

    constructor() {
        this.chain = [this.createGenesisBlock()]; //stores every block in the chain
        this.difficulty = 4; //how difficult the mathematical equation is for miners to mine a block
        this.pendingTransactions = []; //holds every transaction that i want to add to the chain
        this.miningReward = 100; //reward for successfully mining a block
    }

    createGenesisBlock() {
        return new Block(0, "19/12/2022", "Genesis block", "0"); //creates the first block added to the chain
    }

    getLatestBlock() {
        return this.chain.length - 1; //retreiving the last block in the chain
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    addTransaction(transaction) {
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must include from and to address');
        }
        // Verify that the transaction is valid and valid before it can be submitted to the trading pool.
        if (!transaction.isValid()) {
            throw new Error('Cannot add invalid transaction to the chain');
        }

        if (transaction.amount <= 0) {
            throw new Error('Transaction amount should be higher than 0');
        }

        // Verifying that the amount sent is not higher than the existing balance
        const walletBalance = this.getBalanceOfAddress(transaction.fromAddress);
        if (walletBalance < transaction.amount) {
            throw new Error('There is not enough in your balance');
        }

        // The pending transactions for the "from" wallet
        const pendingTxForWallet = this.pendingTransactions.filter(
            tx => tx.fromAddress === transaction.fromAddress
        );

        // Calculating the total amount of spent coins so far, if it exceeds the balance then we cannot add this transaction
        if (pendingTxForWallet.length > 0) {
            const totalPendingAmount = pendingTxForWallet
            .map(tx => tx.amount)
            .reduce((prev, curr) => prev + curr);

            const totalAmount = totalPendingAmount + transaction.amount;
            if (totalAmount > walletBalance) {
                throw new Error(
                    'Pending transactions for this wallet is higher than its balance.'
                );
            }
        }

        // Add tx to the mempool
        this.pendingTransactions.push(transaction);
        console.log('transaction added: %s', transaction);
    }

    minePendingTransactions(miningRewardAddress) {
        const rewardTx = new Transaction(
            null,
            miningRewardAddress,
            this.miningReward
        );
        this.pendingTransactions.push(rewardTx);

        const block = new Block(
            Date.now(), 
            this.pendingTransactions, 
            this.getLatestBlock().hash
            );

        // Mining, that is, constatly trying nonce to make the hash Vluw meet the requirements
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!!!');
        this.chain.push(block);

        // Put the miner fee transactions into pendingTransactions for the next processing operation. The miner fee transaction is
        this.pendingTransactions = [];
    }

    getBalanceOfAddress(address) {
        // iterate over the chain, block by block
        // tx by tx, checking for from and to address
        let balance = 0;
        for (const block of this.chain) {
            for (const transaction of block.transactions) {
                // check if address sent tokens in this tx
                if (transaction.fromAddress === address) {
                    balance -= transaction.amount;
                }

                if (transaction.toAddress === address) {
                    balance += transaction.amount;
                }
            }
        }

        console.log('getBalanceofAddress: %s', balance);
        return balance;
    }

    getAllTransactionForWallet(address) {
        const txs = [];

        for (const block of this.chain) {
            for (const tx of block.transactions) {
                if (tx.fromAddress === address || tx.toAddress === address) {
                    txs.push(tx);
                }
            }
        }

        console.log('get transactions for wallet count: %s', txs.length);
        return txs;
    }

    isChainValid() {
        // Checks genesis block for authenticity
        const realGenesis = JSON.stringify(this.createGenesisBlock());

        if (realGenesis !== JSON.stringify(this.chain[0])) {
            return false;
        }

        // traverse blocks in the chain, having the previous and the current blocks
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (previousBlock.hash !== currentBlock.previousHash) {
                return false;
            }

            // Check if all transactions in the block are valid.
            if (!currentBlock.hasValidTransactions()) {
                return false;
            }

            // Check if current block hash is valid.
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.error("hash not equal: " + JSON.stringify(currentBlock));
                return false;
            }

            // Check block previous hash is valid.
            if (currentBlock.previousHash !== previousBlock.calculateHash()) {
                console.error("previous hash not right: " + JSON.stringify(currentBlock));
                return false;
            }
        }
        return true;
    }
}

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.timestamp = Date.now();
    }

    calculateHash() {
        return crypto
        .createHash('sha256')
        .update(this.fromAddress + this.toAddress + this.amount + this.timestamp)
        .digest('hex');
    }

    signTransaction(signingKey) {
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('You cannot sign transactions for other wallets!');
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');

        this.signature = sig.toDER('hex');
    }

    isValid() {
        if (this.fromAddress === null) return true;
        
        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this transaction');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

// let misterchain = new Blockchain();

// console.log('Block 1 is being mined---');
// misterchain.addBlock(new Block(1, "19/12/2022", { amount: 4 }));

// console.log('Block 2 is being mined---');
// misterchain.addBlock(new Block(2, "19/12/2022", { amount: 8 }));

module.exports.Blockchain = Blockchain;
module.exports.Block = Block;
module.exports.Transaction = Transaction;