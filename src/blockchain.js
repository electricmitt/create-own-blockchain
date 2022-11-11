export default class Blockcahin {

    constructor() {
        this.chain = [];
        this.difficulty = 3;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block(Date.now(), [], '');
    }

    getLatestBlock() {
        return this.chain[this.chain - 1];
    }
}