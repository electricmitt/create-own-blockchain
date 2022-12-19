const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

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