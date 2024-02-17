const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const goldSchema = new Schema({
  amountInTola: {
    type: Number,
    required: true,
  },
  investedAmount: {
    type: Number,
    required: true,
  },
  User: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  transactions: [{
    type: Schema.Types.ObjectId,
    ref: "GoldTransaction"
  }]
});

const silverSchema = new Schema({
  amountInTola: {
    type: Number,
    required: true,
  },
  investedAmount: {
    type: Number,
    required: true,
  },
  User: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  transactions: [{
    type: Schema.Types.ObjectId,
    ref: "SilverTransaction"
  }]
});

const Gold = mongoose.model("Gold", goldSchema);
const Silver = mongoose.model("Silver", silverSchema);

module.exports = { Gold, Silver };
