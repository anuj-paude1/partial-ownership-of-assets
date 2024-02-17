const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pendingBuyingEstateSchema = new Schema({
    realEstate:
    {
        type: Schema.Types.ObjectId,
        ref: "realEstate"
    }
    ,
    pendingToBeBought: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "realEstate"
        },
        numberOfShares: {
            type: Number,
            default: 0
        },
        buyingPricePerShare: {
            type: Number,
        },
    }],
});

module.exports = mongoose.model("pendingBuyingEstate", pendingBuyingEstateSchema);
