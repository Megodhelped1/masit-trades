const mongoose = require('mongoose');

const livetradeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  currencypair: {
    type: String,
    required: true,
  },
  lotsize: {
    type: String,
    required: true,
  },
  entryPrice: {
    type: String,
    required: true,
  },
  stopLoss: {
    type: String,
    required: true,
  },
  takeProfit: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  status: {
    type: String,
    enum: ['Open', 'Closed'],
    default: 'Open',
  },
}, { timestamps: true });

const Livetrading = mongoose.model('livetrade', livetradeSchema);
module.exports = Livetrading;