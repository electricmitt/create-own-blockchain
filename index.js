import Blockchain from './src/blockchain';
import Transaction from './src/transaction';
import { createWallet, validateWallet } from './src/wallet';

// Init Blockchain
const SIMPLE_BLOCKCHAIN = new Blockchain();

// setup wallet, create wallets
const myWallet = createWallet();
const yourWallet = createWallet();

// output that gets the public key from the private key.
console.log("is the myWallet from privateKey equals to publicKey?", validateWallet(myWallet.privateKey, myWallet.publicKey));

// transactions, initiate a transaction and transfer 60 from own wallet to your wallet.
const tx1 = new Transaction(myWallet.publicKey, yourWallet.publicKey, 60);