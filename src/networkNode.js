const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain'); // imports blockchain constructor function
const { v1: uuidv1 } = require('uuid'); // creates unique random string. Used as network's node address
const port = process.argv[2]; // refers to the command in package.json > scripts > start
const rp = require('request-promise');

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


const myKey = ec.keyFromPrivate('b96869e96eea7f882983022cf77b9c908d76662f2fe7cdc4fe5d5146edf3057e');
const myWalletAddress = myKey.getPublic('hex');

const nodeAddress = uuidv1().split('-').join('');

const misterchain = new Blockchain();

// parses data to give access to it via the routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// sends back the blockchain
app.get('/blockchain', function (req, res) {
    res.send(misterchain);
})

//end point to create new transaction on the blockchain
app.post('/transaction', function (req, res) {
    const newTransaction = req.body;
    const blockIndex = misterchain.addTransactionToPendingTransactions(newTransaction);
    res.json({ note: `Transaction will be added in block ${blockIndex}.` });
})

// create and broadcast new transaction to all other nodes on the network
app.post('/transaction/broadcast', function(req, res) {
    const newTransaction = kevcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient)
    misterchain.addTransactionToPendingTransactions(newTransaction);

    const requestPromises = [];
    misterchain.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    // run all requests
    Promise.all(requestPromises)
    .then(data => {
        res.json( {note: 'Transaction created and broadcast successfuly.' });
    });
});

// Will create/mine a new block by using PoW
//Performs calculations to create new block
//////////////////////////////////////////////
app.get('/mine', function (req, res) {
    const lastBlock = misterchain.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: misterchain.pendingTransactions,
        index: lastBlock['index'] + 1
    };

    const nonce = misterchain.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = misterchain.hashBlock(previousBlockHash, currentBlockData, nonce);
    const newBlock = misterchain.createNewBlock(nonce, previousBlockHash, blockHash);
///////////////////////////////////////

    //misterchain.createNewTransaction(12.5, "00", nodeAddress); // Show mining reward

    
    // Broadcast out to all networks
    ////////////////////////////////////
    const requestPromises = [];
    misterchain.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/receive-new-block',
            method: 'POST',
            body: { newBlock: newBlock },
            json: true
        };
        
        requestPromises.push(rp(requestOptions));
    });
    /////////////////////////////////////////

    // Broadcast reward to entire network
    // Make and broadcast mining reward to entire network
    ////////////////////////////////////////////////
    Promise.all(requestPromises)
    .then(data => {
        const requestOptions = {
            uri: misterchain.currentNodeUrl + '/transaction/broadcast',
            method: 'POST',
            body: {
                amount: 12.5,
                sender: "00",
                recipient: nodeAddress // gets current address
            },
            json: true
        };

        return rp(requestOptions);
    })
    // Only send response after all calculations take place
    // After everything runs, send confirmation message
    //////////////////////////////////////////
    .then(data => {
        res.json({
            note: "New block mined successfully!",
            block: newBlock
        });
    })
    /////////////////////////////////////////////////

});

app.post('/receive-new-block', function(req, res) {
    const newBlock = req.body.newBlock;
    const lastBlock = misterchain.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockHash; //cehck to see if the hashes match
    const correctIndex = lastBlock['index'] + 1 == newBlock['index']; // check to make sure the last block has the correct index which should be 1 above the last block

    if (correctHash && correctIndex) {
        misterchain.chain.push(newBlock);
        misterchain.pendingTransactions = []; //clear out the transactions
        res.json({
            note: 'New block received and accepted.',
            newBlock: newBlock
        });
    } else {
        res.json({
            note: 'New block was rejected.',
            newBlock: newBlock
        });
    }
});

////////////////////////////////////////////////////////////////////////
// 1. A new node is added to the network 
// 2. Node registered and broadcast to the other nodes in the network by 
//    hitting the '/register-and-broadcast-node' endpoint with the url of the new node
// 3. All other nodes in the network will receive the data via the '/register-node' endpoint
// 4. After the new URL is registered with the other nodes on the network, the original node
//    will make a request to the new node.
//    It will hit the '/register-nodes-bulk' endpoint and will receive the URLs of all the
//    other nodes in the network.
// 5. All nodes in the network will then be registered with the new node.

// register and broadcast node to the network
app.post('/register-and-broadcast-node', function(req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    // add newNodeUrl to networkNodes array if it is not already present
    if (misterchain.networkNodes.indexOf(newNodeUrl) == -1) misterchain.networkNodes.push(newNodeUrl);

    // Since it is unknown how long it will take to get these requests back, they will be stored in
    // the regNodesPromises array.
    const regNodesPromises = [];
    misterchain.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/register-node',
            method: 'POST',
            body: { newNodeUrl: newNodeUrl },
            json: true
        };

        regNodesPromises.push(rp(requestOptions));
    });

    // run the requests
    Promise.all(regNodesPromises)
    .then(data => {
        const bulkRegisterOptions = {
            uri: newNodeUrl + '/register-nodes-bulk',
            method: 'POST',
            body: { allNetworkNodes: [ ...misterchain.networkNodes, misterchain.currentNodeUrl ] },
            json: true
        };

        return rp(bulkRegisterOptions);
    })
    .then(data => {
        res.json({ note: 'New node registered with network successfully!'})
    })
});

// register a node with the network
// simply a way for the other nodes to recognize the other nodes
app.post('/register-node', function(req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlreadyPresent = misterchain.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = misterchain.currentNodeUrl !== newNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode) misterchain.networkNodes.push(newNodeUrl);
    res.json({ note: 'New node registered successfully.' });
});

// register multiple nodes at once
// registers all existing nodes with the new node
app.post('/register-nodes-bulk', function(req, res) {
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl => {
        const nodeNotAlreadyPresent = misterchain.networkNodes.indexOf(networkNodeUrl) == -1;
        const notCurrentNode = misterchain.currentNodeUrl !== networkNodeUrl;
        if (nodeNotAlreadyPresent && notCurrentNode) misterchain.networkNodes.push(networkNodeUrl);
    });

    res.json({ note: 'Bulk registration successful.' });
});

// CONSENSUS //////////////////
app.get('/consensus', function(req, res) {
    const requestPromises = [];
    misterchain.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/blockchain',
            method: 'GET', 
            json: true
        };

        requestPromises.push(rp(requestOptions));
    }); 

    Promise.all(requestPromises)
    .then(blockchains => {
        const currentChainLength = misterchain.chain.length;
        let maxChainLength = currentChainLength;
        let newLongestChain = null;
        let newPendingTransactions = null;

        blockchains.forEach(blockchain => {
            if (blockchain.chain.length > maxChainLength) {
                maxChainLength = blockchain.chain.length;
                newLongestChain = blockchain.chain;
                newPendingTransactions = blockchain.pendingTransactions;
            };
        });

        if (!newLongestChain || (newLongestChain && !misterchain.chainIsValid(newLongestChain))) {
            res.json({
                note: 'Current chain has not been replaced.',
                chain: misterchain.chain
            });
        }
        else if (newLongestChain && misterchain.chainIsValid(newLongestChain)) {
            misterchain.chain = newLongestChain;
            misterchain.pendingTransactions = newPendingTransactions;
            res.json({
                note: 'This chain has been replaced.',
                chain: misterchain.chain
            });
        }
    });
});


app.get('/block/:blockHash', function(req, res) {
    const blockHash = req.params.blockHash;
    const correctBlock = misterchain.getBlock(blockHash);
    res.json({
        block: correctBlock
    });
});

app.get('/transaction/:transactionId', function(req, res) {
    const transactionId = req.params.transactionId;
    const transactionData = misterchain.getTransaction(transactionId);

    res.json({
        transaction: transactionData.transaction,
        block: transactionData.block
    })
});

app.get('/address/:address', function(req, res) {
    const address = req.params.address;
    const addressData = misterchain.getAddressData(address);
    res.json({
        addressData: addressData
    });
});

// Use .sendFile instead of .json
app.get('/block-explorer', function(req, res) {
    res.sendFile('./frontend/blockchain.html', { root: __dirname }) // says to llok for this file
});

// need a variable for port #
app.listen(port, function() {
    console.log(`Listening on port ${port}...`);
});