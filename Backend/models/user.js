const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    unique: true,
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  citizenshipNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  fatherOrMotherName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  accountOpenDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  totalInvestment: {
    type: Number,
    required: true,
    default: 0,
  },
  totalShares: [{
    info: {
      type: Schema.Types.ObjectId,
      ref: "realEstate"
    },
    numberOfShares: {
      type: Number,
      default: 0
    }
  }],
  digitalCash: {
    type: Number,
    required: true,
    default: 7000
  },
  gold: {
    type: Schema.Types.ObjectId,
    ref: "Gold"
  },
  silver: {
    type: Schema.Types.ObjectId,
    ref: "Silver"
  },
  realEstate: [
    {
      type: Schema.Types.ObjectId,
      ref: "realEstate",
    },
  ],
  transactionDetails: [
    {
      type: Schema.Types.ObjectId,
      ref: "realEstateTransaction",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
