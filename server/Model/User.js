const mongoose = require('mongoose');
const validator = require('validator');
// const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  isSuspended: {
    type: Boolean,
    default: false,
  },
  fullname: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'Please enter an email'],
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  tel: {
    type: String,
    required: [true, 'Please enter your phone number'],
    trim: true,
  },
  currency: {
    type: String,
    required: [true, 'Please select a currency'],
  },
  country: {
    type: String,
    required: [true, 'Please select a country'],
  },
  city: {
    type: String,
    required: [true, 'Please enter your city'],
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  session: {
    type: String,
    default: '0/0',
  },
  image: {
    type: String,
  },
  balance: {
    type: Number,
    default: 0,
  },
  available: {
    type: String,
    default: '0.00',
  },
  zip_code: {
    type: String,
    default: 'None',
  },
  address: {
    type: String,
    default: 'None',
  },
  signalProg: {
    type: String,
    default: '0',
  },
  activeDeposit: {
    type: String,
    default: '0.00',
  },
  profit: {
    type: String,
    default: '0.00',
  },
  totalEarning: {
    type: String,
    default: '0.00',
  },
  totalWidthdraw: {
    type: String,
    default: '0.00',
  },
  progPlus: {
    type: String,
    default: '+0.00%',
  },
  progMinus: {
    type: String,
    default: '-0.00%',
  },
  prog: {
    type: Number,
    default: 0,
  },
  security_question: {
    type: String,
    required: false,
  },
  security_answer: {
    type: String,
    required: false,
    trim: true,
  },
  otp: {
    type: Number,
    default: 0,
  },
  otpExpires: {
    type: Date,
    default: null,
  },
  verificationCode: {
    type: String,
    default: null,
  },
  kycVerified: {
    type: Boolean,
    default: false,
  },
  verifiedStatus: {
    type: String,
    default: 'not Verified!',
  },
  verificationToken: {
    type: String,
    default: null,
  },
  verificationTokenExpires: {
    type: Date,
    default: null,
  },
  copyTrades: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'copyTrade',
  }],
  livetrades: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'livetrade',
  }],
  upgrades: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'upgrade',
  }],
  verified: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'verify',
  }],
  deposits: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'deposit',
  }],
  withdraws: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'withdraw',
  }],
  wallets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'wallet',
  }],
  affliates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'affliate',
  }],
  signals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'signal',
  }],
  stocktrades: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'stocktrade',
  }],
  emailnotification: {
    type: Boolean,
    default: false,
  },
  smsnotification: {
    type: Boolean,
    default: false,
  },
  email_notifications: {
    type: [String],
    default: [],
  },
  escalate_emails: {
    type: [String],
    default: [],
  },
  url: {
    type: String,
    default: '',
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
  },
  dob: {
    type: Date,
  },
  marital_status: {
    type: String,
    enum: ['Single', 'Married', 'Widowed', 'Divorced', 'Separated'],
  },
  age: {
    type: String,
    enum: ['12 - 18', '19 - 32', '33 - 45', '46 - 62', '63 &gt;'],
  },
  state: {
    type: String,
  },
}, { timestamps: true });

// // Hash password before saving
// userSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

// Static login method
// Static login method with plain text password comparison
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw Error('incorrect email');
  }
 
  if (user.isSuspended) {
    throw Error('Your account is suspended. If you believe this is a mistake, please contact support at support@masi-trades.org.');
  }
  // Direct string comparison for passwords
  if (password !== user.password) {
    throw Error('incorrect password');
  }
  return user;
};
const User = mongoose.model('user', userSchema);
module.exports = User;