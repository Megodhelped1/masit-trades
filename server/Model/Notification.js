// New Notification Schema: server/Model/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: false
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['balance_update', 'earning_update', 'withdrawal_update', 'verification_update', 'deposit_created', 'withdrawal_created', 'upgrade_created', 'signal_created', 'verification_created', 'chat_message', 'custom'],
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;