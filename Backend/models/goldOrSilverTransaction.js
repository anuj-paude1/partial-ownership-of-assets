const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gtSchema = new Schema({
    transactionTime: {
        type: String,
        required: true,
        default: new Date().toLocaleString()
    },
    amount: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    gold: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Gold' 
    },
    User: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
});

const stSchema = new Schema({
    transactionTime: {
        type: String,
        required: true,
        default: new Date().toLocaleString()
    },
    amount: {
        type: Number,
        required: true
    },
    silver: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Silver' 
    },
    price: {
        type: Number,
        required: true
    },
    User: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
});

// Export both schemas
const GoldTransaction = mongoose.model("GoldTransaction", gtSchema);
const SilverTransaction = mongoose.model("SilverTransaction", stSchema);

module.exports = { GoldTransaction, SilverTransaction };