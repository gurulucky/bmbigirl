const NFT = require('../model/Nft');

const RARITY = [
    ["Common", 6],
    ["Rare", 5],
    ["Epic", 4],
    ["Legndry", 3],
    ["Mythical", 2],
    ["God", 1]
];

const TOTAL = 21;

const RULE = [
    // [2, ["Common", "Rare", "Epic"]],
    [6, ["Common", "Rare", "Epic", "Legendary", "Mythical"]],
    [21, ["Common", "Rare", "Epic", "Legendary", "Mythical", "God"]]
];

const buy = async (req, res) => {
    try {
        // const newNft = new NFT({
        //     tokenUri:"https://gateway.pinata.cloud/ipfs/QmYEzKHwRHeqyinwxYoraY45KP2cBftpFaDySH1NHwsHwx",
        //     rarity:"Common"
        // });
        // const nft = await newNft.save();
        // res.json({ nft });
        let result = await NFT.find({ minted: true });
        let mintedCount = result.length;
        console.log('Total minted:', mintedCount);
        if (mintedCount === TOTAL) {
            res.json({ uri: null, msg: 'All NFTs were sold.' })
            return;
        }
        let rule = RULE.find(item => item[0] > mintedCount);
        if (rule) {
            result = await NFT.find({ minted: false, rarity: { $in: rule[1] } });
            // console.log(result);
            let id = Math.floor(Math.random() * result.length);
            res.json({ id: result[id].tokenId, uri: result[id].tokenUri, rarity: result[id].rarity, msg: '' });
        } else {
            res.json({ uri: null, msg: 'Buying mystery-box failed.' })
        }
    } catch (err) {
        console.error(err.message);
        res.json({ uri: null, msg: 'Buying mystery-box failed.' })
    }
}

const mint = async (req, res) => {
    let tokenId = req.body.id;
    let account = req.body.account;
    let mintDate = req.body.mintDate;
    try {
        await NFT.updateOne({ tokenId }, { $set: { minted: true, account, mintDate } });
        console.log(`minted: ${tokenId}`);
        res.json({ minted: true });
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
}

const getNFTs = async (req, res) => {
    let account = req.body.account;
    try {
        let nfts = await NFT.find({ account }).sort({mintDate:-1});
        res.json({ nfts });
    } catch (err) {
        console.log(err.message);
        res.json({ nfts: null });
    }
}

module.exports = { buy, mint, getNFTs };