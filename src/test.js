const Blockchain = require('./blockchain');

const misterchain = new Blockchain();



// TESTS CREATENEWBLOCK METHOD
misterchain.createNewBlock(2389, 'OINA90SDNF90N', '90ANSD9F0N9009N');
misterchain.createNewBlock(111, 'OIANSDF0AN09', 'NJNASDNF09ASDF');
misterchain.createNewBlock(2389, 'UINIUN90ANSDF', '99889HBAIUSBDF');

console.log(misterchain);

// TESTS CREATENEWTRANSACTION METHOD
misterchain.createNewBlock(123456, 'ODIHADIOPH78', 'DHNWBK8YEV');
misterchain.createNewTransaction(200, 'SDFHJHWEBJR873HHGE6', '37YH2JGEW92HJ');
misterchain.createNewBlock(123456, 'RWEGU37HERJH35', '8RUWJ92G1NHE7');

console.log(misterchain.chain[1]);

// TESTS CREATENEWTRANSACTION METHOD with 3 new pending transactions
misterchain.createNewBlock(123456, 'ODIHADIOPH78', 'DHNWBK8YEV');
misterchain.createNewTransaction(200, 'SDFHJHWEBJR873HHGE6', '37YH2JGEW92HJ');
misterchain.createNewBlock(123456, 'RWEGU37HERJH35', '8RUWJ92G1NHE7');

misterchain.createNewTransaction(100, 'SDFHJHWEBJR873HHGE6', '37YH2JGEW92HJ');
misterchain.createNewTransaction(200, 'SDFHJHWEBJR873HHGE6', '37YH2JGEW92HJ');
misterchain.createNewTransaction(300, 'SDFHJHWEBJR873HHGE6', '37YH2JGEW92HJ');

misterchain.createNewBlock(123456, '7YEHVWVNX9UKW', '09YW6O2KNSMKE0');

console.log(misterchain.chain[2]);


// TESTS THE HASHBLOCK FUNCTION
const previousBlockHash = 'OUEHRW7823GUY23GU6ERWJEHRV803';
const currentBlockData = [
    {
        amount: 100,
        sender: 'IUWEYIRGUE823YIEJH32',
        recipient: '90IUEBRW73YU2V381Y348'
    },
    {
        amount: 100,
        sender: 'IUWEYIRGUE823YIEJH32',
        recipient: '90IUEBRW73YU2V381Y348'
    },
    {
        amount: 100,
        sender: 'IUWEYIRGUE823YIEJH32',
        recipient: '90IUEBRW73YU2V381Y348'
    }
];
const nonce = 100;

console.log(misterchain.hashBlock(previousBlockHash, currentBlockData, nonce));


