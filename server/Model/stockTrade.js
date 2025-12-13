
const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
    type: {
        type: String
    },
    amount:{
        type: Number
    },

    action: {
        type: String
    },

    status:{
        type: String,
        default: "pending"
    },

    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        // required: true
    }
},{timestamps: true})

const stockTrade = mongoose.model("stocktrade", stockSchema)
module.exports = stockTrade;
