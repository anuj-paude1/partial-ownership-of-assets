const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pendingBuyingUserSchema = new Schema({
  details: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pendingSharesToBuy: [{
    info: {
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
    dateForSorting: {
      type: Date,
      default: Date.now
    }
  }],
  realEstate: [
    {
      type: Schema.Types.ObjectId,
      ref: "realEstate"
    }
  ]
});

const pendingBuyingUser = mongoose.model("pendingBuyingUser", pendingBuyingUserSchema);

module.exports = pendingBuyingUser;