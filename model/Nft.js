const mongoose = require('mongoose');

const NftSchema = new mongoose.Schema({

    tokenUri: {
        type: String,
        required: true
    },
    rarity: {
        type: String,
        required: true
    },
    minted: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('nft', NftSchema);
