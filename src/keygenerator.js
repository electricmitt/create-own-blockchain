const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const bip39 = require('bip39'); //https://www.npmjs.com/package/bip39

//Generate Mnemonic
const mnemonic = bip39.generateMnemonic();

// Generates a new key pair and converts them to hex-strings
const key = ec.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');

// Prints keys to the console
console.log();
console.log(
  'Here is your public key \n',
  publicKey
);

console.log();
console.log(
  'Here is your private key \n',
  privateKey
);

console.log();
console.log(
  'Your Mnemonic Seedphrase. Please store this information somewhere safe. \n',
  mnemonic
);

