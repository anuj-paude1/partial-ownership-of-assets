const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pendingSellingUserSchema = new Schema({
    details: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pendingSharesToSell: [{
        info: {
            type: Schema.Types.ObjectId,
            ref: "realEstate"
        },
        numberOfShares: {
            type: Number,
            default: 0
        },
        sellingPricePerShare: {
            type: Number,
        },
        dateForSorting: {
            type: Date,
            default: Date.now,
        }
    }],
    // PermissionToPartialSelling: {
    //     type: boolean,
    //     required: true,
    //     default: true,
    // },
    realEstate: [
        {
            type: Schema.Types.ObjectId,
            ref: "realEstate"
        }
    ]
});

const pendingSellingUser = mongoose.model("pendingSellingUser", pendingSellingUserSchema);

module.exports = pendingSellingUser;