const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pendingSellingEstateSchema = new Schema({
  realEstate: {
    type: Schema.Types.ObjectId,
    ref: "realEstate",
  },
  pendingToBeSold: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "realEstate",
      },
      numberOfShares: {
        type: Number,
        default: 0,
      },
      sellingPricePerShare: {
        type: Number,
      },
    },
  ],
});

module.exports = mongoose.model(
  "pendingSellingEstate",
  pendingSellingEstateSchema
);
