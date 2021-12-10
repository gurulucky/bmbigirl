const mongoose = require('mongoose');
const NFT = require('../model/Nft');

const DB = 'mongodb+srv://gurulucky:wjsrlgkrdnjs2@cluster0.xe6yw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
// const DB = 'mongodb://localhost:27017/igirl';
// let RARITY = [
//     ["Common", 6],
//     ["Rare", 5],
//     ["Epic", 4],
//     ["Legndry", 3],
//     ["Mythical", 2],
//     ["God", 1]
// ];
/**
 * Common
 * Rare
 * Epic
 * Legendary
 * Mythical
 */
var NAMES = [
    'Esmeralda',
    'Ria',
    'Manda',
    'Charlotte',
    'Lily',
    'Alice'
];
var DESCRIPTIONS = [
    'Common',
    'Rare',
    'Epic',
    'Legendary',
    'Mythical',
    'God'
];
// var RULE_COUNTS = [6, 5, 4, 3, 2, 1];
var RULE_COUNTS = [7999, 1100, 500, 300, 100, 1];


var URIS = [
    "QmapYGfy46ZGERSVrczMbjZwa3T1w23B9ZiWmXY6PiVW38",
    "QmbUFVZgbwjgn32S4bKFNv73ftzu8zoWjuWjvVzdaMBzzM",
    "QmXnEghy69cQxUmMc5MXLbbqJY2ry1zSqe4hdbDvuHJLAG",
    "QmT1TeyF3LFgwQeN54YxvtAhbbE513DFhXn1K9WMHniFYN",
    "Qma698LwJL7Hw4D5SH5pREUgvUEmT5JS8vaBiKPdDNZ7CU",
    "QmXhDzt1QgujQDxhEgtXKKdtr1nqWE9FNCKmHf5SGzb9RX"
];

var TOTAL = 10000;
var ID = 10000;


const connectDB = async () => {
    try {
        await mongoose.connect(DB, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });

        console.log('MongoDB Connected.', DB);
    } catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
};

const create = async () => {
    try {
        await NFT.remove({});
        let KIND_COUNT = RULE_COUNTS.length;
        while (TOTAL) {
            let index;
            do {
                index = Math.floor(Math.random() * KIND_COUNT);
            } while (RULE_COUNTS[index] == 0);
            
            let newNft = new NFT({
                tokenId: ID,
                tokenUri: URIS[index],
                rarity: DESCRIPTIONS[index],
                minted: false
            });
            let res = await newNft.save();
            console.log(res);

            ID += 1;
            RULE_COUNTS[index] -= 1;
            TOTAL -= 1;            
        }
        console.log('end creation');
    } catch (err) {
        console.error(err.message);
    }
}

const main = async()=>{
    await connectDB();
    create();
}

main();