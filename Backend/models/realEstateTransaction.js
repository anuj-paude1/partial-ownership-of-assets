const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const investmentSchema = new Schema({
  transactionTime: {
    type: String,
    required: true,
    default: new Date().toLocaleString(),
  },
  numberOfShares: {
    type: Number,
    required: true,
  },
  investedPerShare: {
    type: Number,
    required: true,
  },
  realEstate: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "realEstate",
  },
  buyingUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  sellingUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("realEstateTransaction", investmentSchema);
