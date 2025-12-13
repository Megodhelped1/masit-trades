const mongoose = require("mongoose");

const signalSchema = new mongoose.Schema({
    packagename: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "pending"
    },
    image: {
        type: String,
        required: true
    },
    narration: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, { timestamps: true });

const Signal = mongoose.model("signal", signalSchema);

module.exports = Signal;