const sha256 = require('sha256');
const currentNodeUrl = process.argv[3]; // grabs url from position 3 index 2
const { v1: uuidv1 } = require('uuid'); 

function Blockchain() {
    this.chain = [];
    this.pendingTransactions = [];
    this.transaction = [];

    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = []; // allows each network to be aware of the other nodes

    // Create the Genesis Block
    this.createNewBlock(100, '0', '0');
};