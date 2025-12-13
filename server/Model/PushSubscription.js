// New PushSubscription Schema: server/Model/PushSubscription.js
const mongoose = require('mongoose');

const pushSubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: false
  },
  endpoint: {
    type: String,
    required: true
  },
  keys: {
    p256dh: String,
    auth: String
  }
}, { timestamps: true });

const PushSubscription = mongoose.model('PushSubscription', pushSubscriptionSchema);
module.exports = PushSubscription;