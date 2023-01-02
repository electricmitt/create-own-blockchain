# `MisterChain Network & Block Explorer`

Open VS Code.

cd blockchain

npm install

Open 3 terminals

In each terminal, open their specific node......npm run node_1.....node_2....

Go to the localhost URLs:

http://localhost:3001/blockchain

http://localhost:3002/blockchain

http://localhost:3003/blockchain

Open Postman

Use the following setup:

POST: http://localhost:3001/register-and-broadcast-node

Body:

{

“newNodeUrl”: http://localhost:3002

}

Then click 'Send'.

Change '3002' to '3003' to register that node as well.

Open or refresh the URLs of all nodes in the browser.

Check to make sure they are all registered with each other. This will be indicated by the 'networkNodes' text at the bottom.

*************************************************************************************************

MINING

Open a new terminal and go to localhost:3001/mine

Check each node for consensus

Go to Postman and use the following criteria:

POST: http://localhost:3002/transaction/broadcast

Body:

{

    “amount”: 150,

    “sender”: “0x218625934823649382764928”,

    “recipient”: “0x9387456298346592384765283746”

}

Click Send

All nodes should have 2 pending transactions

Mine another block

All nodes should show the mining reward and transaction in Index 3

***********************************************************************************************

TESTING FOR CONSENSUS

Open a browser and a tab for each node url.

If necessary, run each node in each specific terminal.

If necessary, register each node on Postman.

Enter the following data:

POST: http://localhost:3001/register-and-broadcast-node

Body:

{

    “newNodeUrl”: “http://localhost:3002

}

Click Send.

Mine blocks on all three nodes. For example:

localhost:3001/mine

localhost:3002/mine (2) – meaning mine two times. To mine a second time, just hit refresh

localhost:3003/mine

Check to see if all three nodes have 5 items in them. This is one less than the times mined.

Open a new terminal to connect a 4th node to the network.

In the VS Code terminal type: npm run node_4

If it reads ‘Listening on port 3003’ then it is working.

Go to Postman and send a request for node 3004. To do this, enter this data:

POST: http://localhost:3001/register-and-broadcast-node

Body:

{

“newNodeUrl”: http://localhost:3004

}

Click 'Send'.

Check to see that it is connected to the network by going to: http://localhost:3004/blockchain
NOTE: At this point, node 4 will not have the correct blocks.

NOTE: The ‘/consensus’ end point will need to be hit in order to fix the issue.

To fix this, go to localhost:3004/consensus and run it.

NOTE: The chain should be replaced with the new blockchain data that is in the other nodes.

Go to localhost:3004/consensus and run it again. This will prompt a note stating that the chain has not been replaced. This is because there was not a need to replace this chain since it is now up to date.

BLOCK EXPLORER

Open localhost:3001/block-explorer

Use data from blockchain and enter in the input text.

Select category and hit 'Search'

Data should populate with same information from the block

Cheers!!
