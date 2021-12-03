const NFT = require('../model/Nft');

const RARITY = [
    ["Basic", 6],
    ["Rare", 5],
    ["Epic", 4],
    ["Legndry", 3],
    ["Mythical", 2],
    ["God", 1]
];

const TOTAL = 21;

const RULE = [
    [2, ["Basic", "Rare", "Epic"]],
    [4, ["Basic", "Rare", "Epic", "Legndry", "Mythical"]],
    [15, ["Basic", "Rare", "Epic", "Legndry", "Mythical", "God"]]
]

const buy = async (req, res) => {
    try {
        // const newNft = new NFT({
        //     tokenUri:"https://gateway.pinata.cloud/ipfs/QmYEzKHwRHeqyinwxYoraY45KP2cBftpFaDySH1NHwsHwx",
        //     rarity:"Basic"
        // });
        // const nft = await newNft.save();
        // res.json({ nft });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

module.exports = { buy };