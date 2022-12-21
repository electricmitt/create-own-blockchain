const Blockchain = require('./blockchain');
const misterchain = new Blockchain();

const bc1 = {
    "chain": [
      {
        "index": 1,
        "timestamp": 1654829762508,
        "transactions": [],
        "nonce": 100,
        "hash": "0",
        "previousBlockHash": "0"
      },
      {
        "index": 2,
        "timestamp": 1654829783320,
        "transactions": [],
        "nonce": 18140,
        "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
        "previousBlockHash": "0"
      },
      {
        "index": 3,
        "timestamp": 1654829886520,
        "transactions": [
          {
            "amount": 12.5,
            "sender": "00",
            "recipient": "dd15d0c0e86811eca1c81555fc480036",
            "transactionId": "e985ddf0e86811eca1c81555fc480036"
          },
          {
            "amount": 10,
            "sender": "AB12CD32F4E",
            "recipient": "CD3S4F765N7",
            "transactionId": "14dab390e86911eca1c81555fc480036"
          },
          {
            "amount": 20,
            "sender": "AB12CD32F4E",
            "recipient": "CD3S4F765N7",
            "transactionId": "17d35a20e86911eca1c81555fc480036"
          },
          {
            "amount": 30,
            "sender": "AB12CD32F4E",
            "recipient": "CD3S4F765N7",
            "transactionId": "1d4e17b0e86911eca1c81555fc480036"
          }
        ],
        "nonce": 11175,
        "hash": "000054658398d824f0724ba69ca2e34115e71caa5f0f0b91c9cc0f8467222785",
        "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
      },
      {
        "index": 4,
        "timestamp": 1654829969594,
        "transactions": [
          {
            "amount": 12.5,
            "sender": "00",
            "recipient": "dd15d0c0e86811eca1c81555fc480036",
            "transactionId": "270127c0e86911eca1c81555fc480036"
          },
          {
            "amount": 40,
            "sender": "AB12CD32F4E",
            "recipient": "CD3S4F765N7",
            "transactionId": "437ba6f0e86911eca1c81555fc480036"
          },
          {
            "amount": 50,
            "sender": "AB12CD32F4E",
            "recipient": "CD3S4F765N7",
            "transactionId": "465f3ee0e86911eca1c81555fc480036"
          },
          {
            "amount": 60,
            "sender": "AB12CD32F4E",
            "recipient": "CD3S4F765N7",
            "transactionId": "491473d0e86911eca1c81555fc480036"
          },
          {
            "amount": 70,
            "sender": "AB12CD32F4E",
            "recipient": "CD3S4F765N7",
            "transactionId": "4bac0ea0e86911eca1c81555fc480036"
          }
        ],
        "nonce": 239193,
        "hash": "00006f2f93101e7e766083bad4c74e56f83eef75db7ebfef27fbedcb1b27d6f7",
        "previousBlockHash": "000054658398d824f0724ba69ca2e34115e71caa5f0f0b91c9cc0f8467222785"
      },
      {
        "index": 5,
        "timestamp": 1654830001360,
        "transactions": [
          {
            "amount": 12.5,
            "sender": "00",
            "recipient": "dd15d0c0e86811eca1c81555fc480036",
            "transactionId": "58853de0e86911eca1c81555fc480036"
          }
        ],
        "nonce": 122429,
        "hash": "00007cacfe89bc4837dd9abf9fe8367631d442c2ead039b085d094da8ee03215",
        "previousBlockHash": "00006f2f93101e7e766083bad4c74e56f83eef75db7ebfef27fbedcb1b27d6f7"
      },
      {
        "index": 6,
        "timestamp": 1654830004293,
        "transactions": [
          {
            "amount": 12.5,
            "sender": "00",
            "recipient": "dd15d0c0e86811eca1c81555fc480036",
            "transactionId": "6b745940e86911eca1c81555fc480036"
          }
        ],
        "nonce": 69230,
        "hash": "000386cdd9bdd80be9b09871ff5fecc06f2503f4b6f3113c820691ee02ce451",
        "previousBlockHash": "00007cacfe89bc4837dd9abf9fe8367631d442c2ead039b085d094da8ee03215"
      }
    ],
    "pendingTransactions": [
      {
        "amount": 12.5,
        "sender": "00",
        "recipient": "dd15d0c0e86811eca1c81555fc480036",
        "transactionId": "6d339570e86911eca1c81555fc480036"
      }
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": []
  }

console.log('VALID: ', misterchain.chainIsValid(bc1.chain));