const mongoose = require("mongoose");
const CopyTrade = require('../Model/CopyTrade');
const Wallet = require("../Model/walletAddress")
const Deposit = require("../Model/depositSchema")
const Withdraw = require("../Model/widthdrawSchema")
const Verify  = require("../Model/verifySchema")
const Upgrade = require("../Model/upgradeSchema")
const Signal = require("../Model/signal")
const Livetrading = require("../Model/livetradingSchema")
const stockTrade = require("../Model/stockTrade")
const Affliate = require("../Model/affiliate")
const Chat = require('../Model/Chat');
const fs = require('fs');
const validator = require('validator');
const User = require('../Model/User');
const cloudinary = require('cloudinary').v2;
const nodemailer = require("nodemailer")
const Notification = require('../Model/Notification'); // New import

console.log('Cloudinary Config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Unified handleErrors function
const handleErrors = (err) => {
  let errors = {
    fullname: '',
    username: '',
    email: '',
    tel: '',
    country: '',
    zip_code: '',
    city: '',
    currency: '',
    password: '',
    address: ''
  };

  // Handle duplicate key errors (MongoDB error code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    if (field === 'email') {
      errors.email = 'That email is already registered';
    } else if (field === 'username') {
      errors.username = 'That username is already taken';
    } else if (field === 'fullname') {
      errors.fullname = 'That full name is already registered';
    }
    return errors;
  }

  // Handle Mongoose validation errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
    return errors;
  }

  // Handle login-specific errors
  if (err.message === 'incorrect email') {
    errors.email = 'Incorrect email';
  } else if (err.message === 'incorrect password') {
    errors.password = 'Incorrect password';
  } else if (err.message === 'Your account is not verified. Please verify it or create another account.') {
    errors.email = err.message;
  } else if (err.message === 'Your account is suspended. If you believe this is a mistake, please contact support at support@digital-topfigmarkets.com') {
    errors.email = err.message;
  }

  // Handle custom errors
  if (err.message === 'All fields are required') {
    errors.fullname = 'All fields are required';
  } else if (err.message === 'Passwords do not match') {
    errors.password = 'Passwords do not match';
  } else if (err.message === 'Invalid email format') {
    errors.email = 'Invalid email format';
  }

  // Handle Nodemailer errors
  if (err.message.includes('nodemailer') || err.message.includes('SMTP')) {
    errors.email = 'Failed to send email. Please try again later or contact support.';
  }

  // Handle generic errors
  if (Object.values(errors).every(val => val === '')) {
    errors.email = 'An unexpected error occurred. Please try again or contact support.';
  }

  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'piuscandothis', { expiresIn: maxAge });
};


module.exports.loginAdmin_post = async (req, res) => {
   const { email, password } = req.body;
    
      try {
          const user = await User.login(email, password);
          const token = createToken(user._id);
          res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
          res.status(200).json({ user: user._id });
      } catch (err) {
          const errors = handleErrors(err);
          if (err.message === 'incorrect email') {
              req.flash('error', 'Invalid email address.');
          } else if (err.message === 'incorrect password') {
              req.flash('error', 'Invalid password.');
          } else if (err.message === 'Your account is not verified. Please verify it or create another account.') {
              req.flash('error', err.message);
          } else if (err.message === 'Your account is suspended. If you believe this is a mistake, please contact support at support@masi-trades.org.') {
              req.flash('error', err.message);
          } else {
              req.flash('error', 'An unexpected error occurred.');
          }
          res.status(400).json({ errors, redirect: '/loginAdmin' });
      }
};

// ***********************ALL USER ADMIN CONTROLLERS *****************************//

// Email function for suspension notification
const sendSuspensionEmail = async (email, fullname, isSuspended) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'digitaltopfigmarket@gmail.com',
      pass: 'pnungxkemhxruqhc'
    }
  });

  const signInUrl = process.env.BASE_URL;
  const status = isSuspended ? 'suspended' : 'reactivated';

  const mailOptions = {
    from: 'support@digital-topfigmarkets.com',
    to: email,
    subject: `Account ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    html: `
      <div style="background-color: #1C2526; padding: 20px; font-family: Arial, sans-serif; color: #F5F6F5; text-align: center; max-width: 600px; margin: 0 auto;">
        <!-- Header -->
        <div style="background-color: #2E3A3B; padding: 15px; border-bottom: 2px solid #F5F6F5;">
          <img src="https://ci3.googleusercontent.com/meips/ADKq_NbWvndY7ipL-Nw8Hmdp3YA_hWPJyT9lZ-TMEC-sIUnu2jcyRInbm0Y0JFSMU-KNB5MRgIwNfml_cVYKSqj0543VjAghNO6rZA=s0-d-e1-ft#https://digital-figtopmarkets.com/images/email.png" alt="Digital Figtop Logo" style="max-width: 150px; height: auto; display: block; margin: 0 auto;">
          <h2 style="color: #F5F6F5; margin: 10px 0 0; font-size: 24px;">Account ${status.charAt(0).toUpperCase() + status.slice(1)}</h2>
        </div>
        <!-- Body -->
        <div style="padding: 20px; font-size: 16px; line-height: 1.5;">
          <h3 style="color: #F5F6F5; font-size: 18px;">Hello, ${fullname}</h3>
          <p style="color: #F5F6F5;">Your account has been ${status}.</p>
          <p style="color: #F5F6F5; font-weight: bold;">${
            isSuspended
              ? 'If you believe this is a mistake, please contact support.'
              : 'You can now log in and access all features.'
          }</p>
          <hr style="border: 1px solid #4A4A4A; margin: 20px 0;">
          <p style="color: #F5F6F5; text-align: left; margin: 10px 0;"><strong>Email:</strong> ${email}</p>
          <hr style="border: 1px solid #4A4A4A; margin: 20px 0;">
          <a href="${signInUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3F3EED; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">Sign In</a>
          <p style="color: #F5F6F5; font-size: 14px;">Status updated on: ${new Date().toLocaleDateString()}</p>
        </div>
        <!-- Footer -->
        <div style="background-color: #2E3A3B; padding: 15px; border-top: 2px solid #F5F6F5; font-size: 14px;">
          <p style="margin: 0 0 10px; color: #F5F6F5;">© ${new Date().getFullYear()} Digital Figtop. All rights reserved.</p>
          <div style="display: flex; justify-content: center; gap: 20px;">
            <a href="mailto:support@digital-topfigmarkets.com" style="color: #4A90E2; text-decoration: none; display: flex; align-items: center; gap: 5px;">
              <img src="https://img.icons8.com/ios-filled/24/4A90E2/email.png" alt="Email Icon" style="width: 20px; height: 20px;">
              <span>Contact Support</span>
            </a>
            <a href="digital-topfigmarkets.com" style="color: #4A90E2; text-decoration: none; display: flex; align-items: center; gap: 5px;">
              <img src="https://img.icons8.com/ios-filled/24/4A90E2/globe.png" alt="Website Icon" style="width: 20px; height: 20px;">
              <span>Visit Website</span>
            </a>
          </div>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Suspension email sent to:', email);
  } catch (error) {
    console.error('Error sending suspension email:', error);
    throw error; // Re-throw to handle in suspendUser
  }
};

module.exports.adminPage = async (req, res) => {
  let perPage = 100;
  let page = parseInt(req.query.page) || 1;
  let sort = req.query.sort || 'createdAt';
  let order = req.query.order || 'desc';
  let status = req.query.status || 'all';

  try {
    let query = {};
    if (status === 'active') {
      query.isSuspended = false;
    } else if (status === 'suspended') {
      query.isSuspended = true;
    }

    let sortField = sort;
    if (sort === 'fullname') {
      sortField = 'fullname'; // Matches schema field
    } else if (sort === 'tel') {
      sortField = 'tel';
    } else if (sort === 'index') {
      sortField = 'createdAt';
    }

    const users = await User.find(query)
      .sort({ [sortField]: order === 'asc' ? 1 : -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .lean(); // Use lean() for better performance

    const count = await User.countDocuments(query);

    res.render('adminDashboard', {
      users,
      page,
      totalPages: Math.ceil(count / perPage),
      sort,
      order,
      status,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error in adminPage:', error);
    req.flash('error', 'Failed to load users');
    res.render('adminDashboard', {
      users: [],
      page: 1,
      totalPages: 1,
      sort: 'createdAt',
      order: 'desc',
      status: 'all',
      success: req.flash('success'),
      error: req.flash('error')
    });
  }
};



    // New suspendUser function
module.exports.suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/adminRoute');
    }

    user.isSuspended = !user.isSuspended;
    await user.save();

    await sendSuspensionEmail(user.email, user.fullname, user.isSuspended);

    req.flash('success', `User ${user.isSuspended ? 'suspended' : 'reactivated'} successfully`);
    res.redirect('/adminRoute');
  } catch (error) {
    console.error('Error in suspendUser:', error);
    req.flash('error', 'Error updating user suspension status');
    res.redirect('/adminRoute');
  }
};

module.exports.viewUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('copyTrades livetrades upgrades verified deposits withdraws wallets affliates signals stocktrades')
      .lean();
    
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/adminRoute');
    }

    res.render('viewUser', {
      user,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error in viewUser:', error);
    req.flash('error', 'Failed to load user details');
    res.redirect('/adminRoute');
  }
};

module.exports.editUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/adminRoute');
    }

    res.render('editUser', {
      user,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error in editUser:', error);
    req.flash('error', 'Failed to load user edit form');
    res.redirect('/adminRoute');
  }
};

module.exports.editUser_post = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullname, username, email, tel, currency, country, city,
      balance, available, activeDeposit, profit, totalEarning,
      totalWidthdraw, zip_code, address, isVerified, kycVerified, verifiedStatus,
      isSuspended, session, progPlus,progMinus,signalProg,prog,
    } = req.body;

    // Validate required fields
    if (!fullname?.trim() || !username?.trim() || !email?.trim() || !tel?.trim() || !currency?.trim() || !country?.trim() || !city?.trim()) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Check for duplicate username or email
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
      _id: { $ne: id }
    });
    if (existingUser) {
      return res.status(400).json({
        error: existingUser.username === username ? 'Username already exists' : 'Email already exists'
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const originalUser = await User.findById(id); // Get original for comparison

    const updateData = {
      fullname,
      username,
      email,
      tel,
      currency,
      country,
      city,
      prog,
      balance: parseFloat(balance) || 0,
      available: parseFloat(available) || '0.00',
      activeDeposit: parseFloat(activeDeposit) || '0.00',
      profit: parseFloat(profit) || '0.00',
      totalEarning: parseFloat(totalEarning) || '0.00',
      totalWidthdraw: parseFloat(totalWidthdraw) || '0.00',
      signalProg,
      progPlus,
      progMinus,
      zip_code: zip_code || 'None',
      address: address || 'None',
      isVerified: isVerified === 'true',
      kycVerified: kycVerified === 'true',
      verifiedStatus: verifiedStatus || 'not Verified!',
      isSuspended: isSuspended === 'true',
      session: session || '0/0',
    };

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // New: Check for changes and notify user
    if (originalUser.available !== user.available) {
      const balanceNotif = new Notification({
        user: id,
        title: 'Balance Updated',
        message: `Your available balance has been updated to ${user.available}.`,
        type: 'balance_update'
      });
      await balanceNotif.save();
      req.io.to(`notifications_${id}`).emit('newNotification', balanceNotif);
    }
    if (originalUser.totalEarning !== user.totalEarning) {
      const earningNotif = new Notification({
        user: id,
        title: 'Earnings Updated',
        message: `Your total earnings have been updated to ${user.totalEarning}.`,
        type: 'earning_update'
      });
      await earningNotif.save();
      req.io.to(`notifications_${id}`).emit('newNotification', earningNotif);
    }
    if (originalUser.totalWidthdraw !== user.totalWidthdraw) {
      const withdrawNotif = new Notification({
        user: id,
        title: 'Withdrawal Total Updated',
        message: `Your total withdrawals have been updated to ${user.totalWidthdraw}.`,
        type: 'withdrawal_update'
      });
      await withdrawNotif.save();
      req.io.to(`notifications_${id}`).emit('newNotification', withdrawNotif);
    }
    if (originalUser.verifiedStatus !== user.verifiedStatus) {
      const verifyNotif = new Notification({
        user: id,
        title: 'Verification Status Updated',
        message: `Your verification status is now ${user.verifiedStatus}.`,
        type: 'verification_update'
      });
      await verifyNotif.save();
      req.io.to(`notifications_${id}`).emit('newNotification', verifyNotif);
    }

    return res.status(200).json({ message: 'User updated successfully', redirect: `/viewUser/${id}` });
  } catch (error) {
    console.error('Error in editUser_post:', error);
    return res.status(500).json({ error: 'Failed to update user' });
  }
};

// Render search results page
module.exports.searchUsersPage = async (req, res) => {
  try {
    const { search } = req.query;
    let users = [];
    let page = parseInt(req.query.page) || 1;
    const perPage = 100;
    let sort = req.query.sort || 'createdAt';
    let order = req.query.order || 'desc';

    if (search) {
      users = await User.find({
        $or: [
          { fullname: { $regex: search, $options: 'i' } },
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      })
        .sort({ [sort]: order === 'asc' ? 1 : -1 })
        .skip(perPage * (page - 1))
        .limit(perPage)
        .lean();

      const count = await User.countDocuments({
        $or: [
          { fullname: { $regex: search, $options: 'i' } },
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      });

      return res.render('searchUsers', {
        users,
        page,
        totalPages: Math.ceil(count / perPage),
        sort,
        order,
        status: 'all',
        search,
        success: req.flash('success'),
        error: req.flash('error')
      });
    }

    res.render('searchUsers', {
      users: [],
      page: 1,
      totalPages: 1,
      sort: 'createdAt',
      order: 'desc',
      status: 'all',
      search: '',
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error in searchUsersPage:', error);
    req.flash('error', 'An error occurred while searching users');
    res.render('searchUsers', {
      users: [],
      page: 1,
      totalPages: 1,
      sort: 'createdAt',
      order: 'desc',
      status: 'all',
      search: '',
      success: req.flash('success'),
      error: req.flash('error')
    });
  }
};
// Handle search form submission
module.exports.searchUsers_post = async (req, res) => {
  try {
    const { search } = req.body;
    if (!search || search.trim() === '') {
      req.flash('error', 'Please enter a search term');
      return res.redirect('/searchUsers');
    }
    res.redirect(`/searchUsers?search=${encodeURIComponent(search.trim())}`);
  } catch (error) {
    console.error('Error in searchUsers_post:', error);
    req.flash('error', 'An error occurred while processing your search');
    res.redirect('/searchUsers');
  }
};

module.exports.deletePage = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/adminRoute');
    }
    req.flash('success', 'User deleted successfully');
    res.redirect('/adminRoute');
  } catch (error) {
    console.error('Error in deletePage:', error);
    req.flash('error', 'Failed to delete user');
    res.redirect('/adminRoute');
  }
};

//******************************************/ start of admin all chart controller **************************************//

module.exports.getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find().populate('user');
    res.render('allChats', { chats });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong!');
    res.redirect('/adminRoute');
  }
};

module.exports.viewChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id).populate('user');
    if (!chat) {
      req.flash('error', 'Chat not found');
      return res.redirect('/all-chats');
    }
    res.render('viewChat', { chat });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong!');
    res.redirect('/all-chats');
  }
};

module.exports.respondChat = async (req, res) => {
  try {
    const { content } = req.body;
    let imageUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      req.flash('error', 'Chat not found');
      return res.redirect('/all-chats');
    }

    const message = {
      sender: 'admin',
      content,
      image: imageUrl,
      timestamp: new Date(),
    };

    chat.messages.push(message);
    await chat.save();

    // Emit message via Socket.IO
    req.app.get('io').to(chat.user.toString()).emit('newMessage', message);
    req.app.get('io').to('admin').emit('newMessage', { userId: chat.user, message });

    // New: Notify user of admin response
    const responseNotif = new Notification({
      user: chat.user,
      title: 'New Admin Response',
      message: 'You have a new response in your chat.',
      type: 'chat_message'
    });
    await responseNotif.save();
    req.io.to(`notifications_${chat.user}`).emit('newNotification', responseNotif);

    req.flash('success', 'Response sent');
    res.redirect(`/chat/${req.params.id}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong!');
    res.redirect(`/chat/${req.params.id}`);
  }
};


module.exports.deleteChat = async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    req.flash('success', 'Chat deleted');
    res.redirect('/all-chats');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong!');
    res.redirect('/all-chats');
  }
};

// New: Admin notifications page
module.exports.notificationsPage = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: null }).sort({ createdAt: -1 }); // Admin notifications (user: null)
    res.render('adminNotifications', { notifications });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error loading notifications');
    res.redirect('/adminRoute');
  }
};

// New: Send custom notification to user
module.exports.sendCustomNotification = async (req, res) => {
  try {
    const { title, message } = req.body;
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const customNotif = new Notification({
      user: userId,
      title,
      message,
      type: 'custom'
    });
    await customNotif.save();
    req.io.to(`notifications_${userId}`).emit('newNotification', customNotif);

    req.flash('success', 'Custom notification sent successfully');
    res.redirect(`/viewUser/${userId}`);
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to send notification');
    res.redirect('back');
  }
};


// **************************************** end of admin all chart controller *********************************************//


// module.exports.generateOTP = async (req, res) => {
//   try {
//       const user = await User.findById(req.params.id);
//       if (!user) {
//           return res.status(404).json({ error: "User not found" });
//       }

//       // Generate 6-digit OTP
//       const otp = Math.floor(100000 + Math.random() * 900000);
      
//       // Set OTP and expiration (24 hours)
//       user.otp = otp;
//       user.otpExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // Changed to 24 hours
//       await user.save();

//       res.json({ otp: otp, message: "OTP generated successfully" });
//   } catch (error) {
//       console.log(error);
//       res.status(500).json({ error: "Error generating OTP" });
//   }
// };


// *****************************ALL DEPOSIT CONTROLLERS  ***************************************//

exports.getAllDepositsPage = async (req, res) => {
    try {
        const deposits = await Deposit.find().populate('owner', 'fullname');
        res.render('allFunding', { deposits, messages: req.flash('success') });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error fetching deposits');
        res.redirect('/allFunding');
    }
};

exports.editDepositPage = async (req, res) => {
    try {
        const deposit = await Deposit.findById(req.params.id);
        if (!deposit) {
            req.flash('error', 'Deposit not found');
            return res.redirect('/allFunding');
        }
        res.render('edit-deposit', { deposit });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error fetching deposit');
        res.redirect('/allFunding');
    }
};

module.exports.updateDeposit = async (req, res) => {
    try {
        const { type, amount, narration, status } = req.body;
        const originalDeposit = await Deposit.findById(req.params.id);
        await Deposit.findByIdAndUpdate(req.params.id, { type, amount, narration, status });

        // New: If status changed, notify user
        if (originalDeposit.status !== status) {
          const user = await User.findById(originalDeposit.owner);
          const depositNotif = new Notification({
            user: originalDeposit.owner,
            title: 'Deposit Status Updated',
            message: `Your deposit of ${amount} ${type} is now ${status}.`,
            type: 'deposit_created' // Reuse type or new
          });
          await depositNotif.save();
          req.io.to(`notifications_${originalDeposit.owner}`).emit('newNotification', depositNotif);
        }

        req.flash('success', 'Deposit updated successfully');
        res.redirect('/allFunding');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error updating deposit');
        res.redirect(`/edit-deposit/${req.params.id}`);
    }
};

module.exports.deleteDeposit = async (req, res) => {
    try {
        await Deposit.findByIdAndDelete(req.params.id);
        req.flash('success', 'Deposit deleted successfully');
        res.redirect('/allFunding');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error deleting deposit');
        res.redirect('/allFunding');
    }
};


// ***********************************ALL WALLET ADMIN CONTROLLERS *************************//

// / Fetch all withdrawals
module.exports.getWithdrawals = async (req, res) => {
    try {
        const perPage = 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';

        const totalWithdrawals = await Withdraw.countDocuments();
        const totalPages = Math.ceil(totalWithdrawals / perPage);

        const withdrawals = await Withdraw.find()
            .populate('owner', 'fullname email')
            .sort({ [sort === 'owner' ? 'owner.fullname' : sort]: order === 'asc' ? 1 : -1 })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .lean();

        res.render('withdrawals', {
            withdrawals,
            messages: req.flash(),
            page,
            totalPages,
            sort,
            order
        });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error fetching withdrawals');
        res.redirect('/adminRoute');
    }
};

// Edit withdrawal page
module.exports.editWithdrawalPage = async (req, res) => {
    try {
        const withdrawal = await Withdraw.findById(req.params.id).populate('owner', 'fullname email').lean();
        if (!withdrawal) {
            req.flash('error', 'Withdrawal not found');
            return res.redirect('/allWithdrawals');
        }
        res.render('withdrawal-edit', { withdrawal, messages: req.flash() });
    } catch (error) {
        console.error('Error in editWithdrawalPage:', error);
        req.flash('error', 'Error loading edit page');
        res.redirect('/allWithdrawals');
    }
};

// Update withdrawal
module.exports.editWithdrawal = async (req, res) => {
    try {
        console.log('Received form data:', req.body); // Debug log
        const { amount, status, narration, walletAddress, cashAppTag, paypalEmail, bankName, accountNumber, country, swiftCode } = req.body;
        const withdrawal = await Withdraw.findById(req.params.id);
        if (!withdrawal) {
            console.log('Withdrawal not found for ID:', req.params.id); // Debug log
            req.flash('error', 'Withdrawal not found');
            return res.redirect('/allWithdrawals');
        }

        // Validate amount
        if (!amount || isNaN(amount) || amount <= 0) {
            console.log('Invalid amount:', amount); // Debug log
            req.flash('error', 'Invalid amount');
            return res.redirect(`/withdrawals-edit/${req.params.id}`);
        }

        // Validate status
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            console.log('Invalid status:', status); // Debug log
            req.flash('error', 'Invalid status');
            return res.redirect(`/withdrawals-edit/${req.params.id}`);
        }

        // Validate conditional fields based on type
        if (['Bitcoin', 'Ethereum', 'USDT'].includes(withdrawal.type) && !walletAddress) {
            console.log('Missing walletAddress for type:', withdrawal.type); // Debug log
            req.flash('error', 'Wallet address is required for this withdrawal type');
            return res.redirect(`/withdrawals-edit/${req.params.id}`);
        }
        if (withdrawal.type === 'CashApp' && !cashAppTag) {
            console.log('Missing cashAppTag'); // Debug log
            req.flash('error', 'CashApp tag is required');
            return res.redirect(`/withdrawals-edit/${req.params.id}`);
        }
        if (withdrawal.type === 'PayPal' && !paypalEmail) {
            console.log('Missing paypalEmail'); // Debug log
            req.flash('error', 'PayPal email is required');
            return res.redirect(`/withdrawals-edit/${req.params.id}`);
        }
        if (withdrawal.type === 'Bank Transfer') {
            if (!bankName || !accountNumber || !country || !swiftCode) {
                console.log('Missing bank details:', { bankName, accountNumber, country, swiftCode }); // Debug log
                req.flash('error', 'All bank details are required');
                return res.redirect(`/withdrawals-edit/${req.params.id}`);
            }
        }

        // Track original amount and status for refund logic
        const originalAmount = withdrawal.amount;
        const originalStatus = withdrawal.status;
        console.log('Original withdrawal:', { originalAmount, originalStatus }); // Debug log

        // Update fields
        withdrawal.amount = parseFloat(amount).toFixed(2);
        withdrawal.status = status;
        withdrawal.narration = narration || withdrawal.narration;
        if (['Bitcoin', 'Ethereum', 'USDT'].includes(withdrawal.type)) {
            withdrawal.walletAddress = walletAddress;
        }
        if (withdrawal.type === 'CashApp') {
            withdrawal.cashAppTag = cashAppTag;
        }
        if (withdrawal.type === 'PayPal') {
            withdrawal.paypalEmail = paypalEmail;
        }
        if (withdrawal.type === 'Bank Transfer') {
            withdrawal.bankDetails = { bankName, accountNumber, country, swiftCode };
        }

        await withdrawal.save();
        console.log('Withdrawal saved:', withdrawal); // Debug log

        // New: If status changed, notify user
        if (originalStatus !== status) {
          const withdrawalNotif = new Notification({
            user: withdrawal.owner,
            title: 'Withdrawal Status Updated',
            message: `Your withdrawal of ${amount} ${withdrawal.type} is now ${status}.`,
            type: 'withdrawal_created' // Reuse
          });
          await withdrawalNotif.save();
          io.to(`notifications_${withdrawal.owner}`).emit('newNotification', withdrawalNotif);
        }

        // Handle refund logic for rejected status or amount change
        if (status === 'rejected' && originalStatus !== 'rejected') {
            const user = await User.findById(withdrawal.owner);
            if (!user) {
                console.log('User not found for ID:', withdrawal.owner); // Debug log
                req.flash('error', 'User not found');
                return res.redirect(`/withdrawals-edit/${req.params.id}`);
            }
            user.available = (parseFloat(user.available) + parseFloat(withdrawal.amount)).toFixed(2);
            await user.save();

            // New: Notify user of refund
            const refundNotif = new Notification({
              user: withdrawal.owner,
              title: 'Withdrawal Rejected - Refunded',
              message: `Your withdrawal was rejected and amount refunded to balance.`,
              type: 'withdrawal_update'
            });
            await refundNotif.save();
            req.io.to(`notifications_${withdrawal.owner}`).emit('newNotification', refundNotif);

            console.log('User balance updated (rejected):', user.available); // Debug log
        } else if (status !== 'rejected' && originalStatus === 'rejected') {
            const user = await User.findById(withdrawal.owner);
            if (!user) {
                console.log('User not found for ID:', withdrawal.owner); // Debug log
                req.flash('error', 'User not found');
                return res.redirect(`/withdrawals-edit/${req.params.id}`);
            }
            if (parseFloat(user.available) < parseFloat(withdrawal.amount)) {
                console.log('Insufficient balance:', { available: user.available, amount: withdrawal.amount }); // Debug log
                req.flash('error', 'User has insufficient balance to revert rejection');
                return res.redirect(`/withdrawals-edit/${req.params.id}`);
            }
            user.available = (parseFloat(user.available) - parseFloat(withdrawal.amount)).toFixed(2);
            await user.save();

            // New: Notify user of status revert
            const revertNotif = new Notification({
              user: withdrawal.owner,
              title: 'Withdrawal Status Reverted',
              message: `Your withdrawal status has been updated from rejected.`,
              type: 'withdrawal_update'
            });
            await revertNotif.save();
            req.io.to(`notifications_${withdrawal.owner}`).emit('newNotification', revertNotif);

            console.log('User balance updated (revert rejection):', user.available); // Debug log
        } else if (status === 'rejected' && originalAmount !== withdrawal.amount) {
            const user = await User.findById(withdrawal.owner);
            if (!user) {
                console.log('User not found for ID:', withdrawal.owner); // Debug log
                req.flash('error', 'User not found');
                return res.redirect(`/withdrawals-edit/${req.params.id}`);
            }
            user.available = (parseFloat(user.available) - parseFloat(originalAmount) + parseFloat(withdrawal.amount)).toFixed(2);
            await user.save();

            // New: Notify user of amount change
            const amountNotif = new Notification({
              user: withdrawal.owner,
              title: 'Withdrawal Amount Updated',
              message: `Your withdrawal amount has been adjusted to ${withdrawal.amount}.`,
              type: 'withdrawal_update'
            });
            await amountNotif.save();
            req.io.to(`notifications_${withdrawal.owner}`).emit('newNotification', amountNotif);

            console.log('User balance updated (amount change):', user.available); // Debug log
        }

        req.flash('success', 'Withdrawal updated successfully');
        console.log('Redirecting to /allWithdrawals'); // Debug log
        res.redirect('/allWithdrawals');
    } catch (error) {
        console.error('Error in editWithdrawal:', error); // Debug log
        req.flash('error', 'Error updating withdrawal');
        res.redirect(`/withdrawals-edit/${req.params.id}`);
    }
};

// Delete withdrawal
module.exports.deleteWithdrawal = async (req, res) => {
    try {
        const withdrawal = await Withdraw.findById(req.params.id);
        if (!withdrawal) {
            req.flash('error', 'Withdrawal not found');
            return res.redirect('/allWidthdrawals');
        }

        // If the withdrawal was approved, do not allow deletion (optional, commented out)
        // if (withdrawal.status === 'approved') {
        //     req.flash('error', 'Cannot delete an approved withdrawal');
        //     return res.redirect('/allWidthdrawals');
        // }

        // Remove withdrawal from user's withdrawals array
        await User.findByIdAndUpdate(withdrawal.owner, {
            $pull: { widthdraws: withdrawal._id },
        });

        // If pending, refund the amount to the user's balance
        // if (withdrawal.status === 'pending') {
        //     const user = await User.findById(withdrawal.owner);
        //     user.available = (parseFloat(user.available) + parseFloat(withdrawal.amount)).toFixed(2);
        //     await user.save();
        // }

        // Delete the withdrawal document
        await Withdraw.findByIdAndDelete(withdrawal._id);

        req.flash('success', 'Withdrawal deleted successfully');
        res.redirect('/allWidthdrawals');
    } catch (error) {
        console.error('Error in deleteWithdrawal:', error);
        req.flash('error', 'Error deleting withdrawal');
        res.redirect('/allWidthdrawals');
    }
};


// ************************************ALL ADMIN AFFILIATE CODES ****************************************//

module.exports.allAffiliates = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';

    const affiliates = await Affliate.find()
      .populate('owner')
      .sort({ [sort]: order === 'asc' ? 1 : -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .lean();

    const count = await Affliate.countDocuments();
    res.render('allAffiliates', {
      affiliates,
      page,
      totalPages: Math.ceil(count / perPage),
      sort,
      order,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error in allAffiliates:', error);
    req.flash('error', 'Failed to load affiliates');
    res.redirect('/adminRoute');
  }
};

// module.exports.viewAffiliate = async (req, res) => {
//   try {
//     const affiliate = await Affliate.findById(req.params.id).populate('owner').lean();
//     if (!affiliate) {
//       req.flash('error', 'Affiliate not found');
//       return res.redirect('/all-affiliates');
//     }
//     res.render('viewAffiliate', { affiliate, success: req.flash('success'), error: req.flash('error') });
//   } catch (error) {
//     console.error('Error in viewAffiliate:', error);
//     req.flash('error', 'Failed to load affiliate details');
//     res.redirect('/all-affiliates');
//   }
// };

module.exports.deleteAffiliate = async (req, res) => {
  try {
    const affiliate = await Affliate.findById(req.params.id);
    if (!affiliate) {
      req.flash('error', 'Affiliate not found');
      return res.redirect('/all-affiliates');
    }
    await Affliate.deleteOne({ _id: req.params.id });
    await User.updateOne(
      { affliates: req.params.id },
      { $pull: { affliates: req.params.id } }
    );
    req.flash('success', 'Affiliate deleted successfully');
    res.redirect('/all-affiliates');
  } catch (error) {
    console.error('Error in deleteAffiliate:', error);
    req.flash('error', 'Failed to delete affiliate');
    res.redirect('/all-affiliates');
  }
};




// Get all copy trades for admin (existing traders)
module.exports.getAllCopyTradesPage = async (req, res) => {
  try {
    const copyTrades = await CopyTrade.find({ owner: { $exists: false } }); // Exclude user copy trades
    res.render('allCopyTrades', { copyTrades, messages: req.flash() });
  } catch (error) {
    console.error('Error loading copy trades:', error);
    req.flash('error', 'Error loading copy trades');
    res.redirect('/adminRoute');
  }
};



module.exports.addCopyTradePage = (req, res) => {
  res.render('addCopytrader', { messages: req.flash(), copyTrade: null });
};

module.exports.addCopyTrade_post = async (req, res) => {
  try {
    let traderImage = '';
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'copytraders',
          allowed_formats: ['jpg', 'jpeg', 'png']
        });
        traderImage = result.secure_url;
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        throw new Error('Cloudinary upload failed: ' + uploadError.message);
      }
    }

    const { traderName, profitShare, winRate } = req.body;

    if (!traderName || traderName.trim() === '') {
      throw new Error('Trader name is required');
    }
    const profitShareNum = parseFloat(profitShare);
    const winRateNum = parseFloat(winRate);
    if (isNaN(profitShareNum) || profitShareNum < 0 || profitShareNum > 100) {
      throw new Error('Profit share must be between 0 and 100');
    }
    if (isNaN(winRateNum) || winRateNum < 0 || winRateNum > 100) {
      throw new Error('Win rate must be between 0 and 100');
    }

    const copyTrade = new CopyTrade({
      traderName,
      traderImage: traderImage || 'default-image-url',
      profitShare: profitShareNum,
      winRate: winRateNum
    });

    await copyTrade.save();
    req.flash('success', 'Copy trade added successfully');
    res.redirect('/all-copytrades');
  } catch (error) {
    console.error('Add copy trade error:', error);
    req.flash('error', 'Error adding copy trade: ' + error.message);
    res.redirect('/add-copytrader');
  }
};

module.exports.editCopyTradePage = async (req, res) => {
  try {
    const copyTrade = await CopyTrade.findById(req.params.id);
    if (!copyTrade) {
      req.flash('error', 'Copy trade not found');
      return res.redirect('/all-copytrades');
    }
    res.render('editCopytrader', { copyTrade, messages: req.flash() });
  } catch (error) {
    console.error('Error loading copy trade:', error);
    req.flash('error', 'Error loading copy trade');
    res.redirect('/all-copytrades');
  }
};

module.exports.updateCopyTrade = async (req, res) => {
  try {
    const copyTrade = await CopyTrade.findById(req.params.id);
    if (!copyTrade) {
      req.flash('error', 'Copy trade not found');
      return res.redirect('/all-copytrades');
    }

    let traderImage = copyTrade.traderImage;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      traderImage = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const { traderName, profitShare, winRate } = req.body;
    copyTrade.traderName = traderName;
    copyTrade.traderImage = traderImage;
    copyTrade.profitShare = parseFloat(profitShare);
    copyTrade.winRate = parseFloat(winRate);

    await copyTrade.save();
    req.flash('success', 'Copy trade updated successfully');
    res.redirect('/all-copytrades');
  } catch (error) {
    console.error('Error updating copy trade:', error);
    req.flash('error', 'Error updating copy trade: ' + error.message);
    res.redirect(`/edit-copytrader/${req.params.id}`);
  }
};

module.exports.deleteCopyTrade = async (req, res) => {
  try {
    const copyTradeId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(copyTradeId)) {
      req.flash('error', 'Invalid copy trade ID');
      return res.redirect('/all-copytrades');
    }
    const copyTrade = await CopyTrade.findById(copyTradeId);
    if (!copyTrade) {
      req.flash('error', 'Copy trade not found');
      return res.redirect('/all-copytrades');
    }

    if (copyTrade.traderImage && copyTrade.traderImage !== 'default-image-url') {
      const publicId = copyTrade.traderImage.split('/').pop().split('.')[0];
      const fullPublicId = `copytraders/${publicId}`;
      try {
        await cloudinary.uploader.destroy(fullPublicId);
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError);
        throw new Error('Failed to delete image from Cloudinary');
      }
    }

    await User.updateMany(
      { copyTrades: copyTradeId },
      { $pull: { copyTrades: copyTradeId } }
    );

    await CopyTrade.findByIdAndDelete(copyTradeId);

    req.flash('success', 'Copy trade deleted successfully');
    res.redirect('/all-copytrades');
  } catch (error) {
    console.error('Delete copy trade error:', error);
    req.flash('error', `Error deleting copy trade: ${error.message}`);
    res.redirect('/all-copytrades');
  }
};

// New controllers for user copy trades
module.exports.getAllUserCopyTradesPage = async (req, res) => {
  try {
    // Fetch users with populated copyTrades
    const users = await User.find({ copyTrades: { $ne: [] } })
      .populate({
        path: 'copyTrades',
        match: { owner: { $exists: true } } // Only user-initiated copy trades
      })
      .select('fullname email copyTrades');

    // Flatten copy trades with user info
    const userCopyTrades = users
      .filter(user => user.copyTrades.length > 0)
      .map(user => ({
        userId: user._id,
        userFullname: user.fullname,
        userEmail: user.email,
        copyTrades: user.copyTrades
      }));

    res.render('allUserCopyTrades', { userCopyTrades, messages: req.flash() });
  } catch (error) {
    console.error('Error loading user copy trades:', error);
    req.flash('error', 'Error loading user copy trades');
    res.redirect('/adminRoute');
  }
};

module.exports.editUserCopyTradePage = async (req, res) => {
  try {
    const copyTradeId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(copyTradeId)) {
      req.flash('error', 'Invalid copy trade ID');
      return res.redirect('/user-copytrades');
    }

    const copyTrade = await CopyTrade.findById(copyTradeId).populate('owner', 'fullname email');
    if (!copyTrade || !copyTrade.owner) {
      req.flash('error', 'User copy trade not found');
      return res.redirect('/user-copytrades');
    }

    res.render('editUserCopyTrade', { copyTrade, messages: req.flash() });
  } catch (error) {
    console.error('Error loading edit user copy trade:', error);
    req.flash('error', 'Error loading user copy trade');
    res.redirect('/user-copytrades');
  }
};

// module.exports.updateUserCopyTrade = async (req, res) => {
//   try {
//     const copyTradeId = req.params.id;
//     if (!mongoose.Types.ObjectId.isValid(copyTradeId)) {
//       req.flash('error', 'Invalid copy trade ID');
//       return res.redirect('/user-copytrades');
//     }

//     const copyTrade = await CopyTrade.findById(copyTradeId);
//     if (!copyTrade || !copyTrade.owner) {
//       req.flash('error', 'User copy trade not found');
//       return res.redirect('/user-copytrades');
//     }

//     const { amount, duration, status } = req.body;

//     // Validate inputs
//     const amountNum = parseFloat(amount);
//     const durationNum = parseInt(duration);
//     if (isNaN(amountNum) || amountNum <= 0) {
//       throw new Error('Amount must be a positive number');
//     }
//     if (isNaN(durationNum) || durationNum <= 0) {
//       throw new Error('Duration must be a positive number');
//     }
//     if (!['ongoing', 'completed', 'cancelled'].includes(status)) {
//       throw new Error('Invalid status');
//     }

//     // Update fields
//     copyTrade.amount = amountNum;
//     copyTrade.duration = durationNum;
//     copyTrade.status = status;
//     copyTrade.startDate = new Date();
//     copyTrade.endDate = new Date(new Date().setDate(new Date().getDate() + durationNum));

//     await copyTrade.save();
//     req.flash('success', 'User copy trade updated successfully');
//     res.redirect('/user-copytrades');
//   } catch (error) {
//     console.error('Error updating user copy trade:', error);
//     req.flash('error', `Error updating user copy trade: ${error.message}`);
//     res.redirect(`/edit-user-copytrade/${req.params.id}`);
//   }
// };

module.exports.updateUserCopyTrade = async (req, res) => {
  try {
    const copyTradeId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(copyTradeId)) {
      req.flash('error', 'Invalid copy trade ID');
      return res.redirect('/user-copytrades');
    }

    const copyTrade = await CopyTrade.findById(copyTradeId);
    if (!copyTrade || !copyTrade.owner) {
      req.flash('error', 'User copy trade not found');
      return res.redirect('/user-copytrades');
    }

    const { amount, duration, status } = req.body;

    // Validate inputs
    const amountNum = parseFloat(amount);
    const durationNum = parseInt(duration);
    if (isNaN(amountNum) || amountNum <= 0) {
      throw new Error('Amount must be a positive number');
    }
    if (isNaN(durationNum) || durationNum <= 0) {
      throw new Error('Duration must be a positive number');
    }
    if (!['ongoing', 'completed', 'cancelled'].includes(status)) {
      throw new Error('Invalid status');
    }

    // Update fields
    copyTrade.amount = amountNum;
    copyTrade.duration = durationNum;
    copyTrade.status = status;
    copyTrade.startDate = new Date();
    copyTrade.endDate = new Date(new Date().setDate(new Date().getDate() + durationNum));

    await copyTrade.save();
    req.flash('success', 'User copy trade updated successfully');
    res.redirect('/user-copytrades');
  } catch (error) {
    console.error('Error updating user copy trade:', error);
    req.flash('error', `Error updating user copy trade: ${error.message}`);
    res.redirect(`/edit-user-copytrade/${req.params.id}`);
  }
};

module.exports.deleteUserCopyTrade = async (req, res) => {
  try {
    const copyTradeId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(copyTradeId)) {
      req.flash('error', 'Invalid copy trade ID');
      return res.redirect('/user-copytrades');
    }

    const copyTrade = await CopyTrade.findById(copyTradeId).populate('owner', 'fullname email');
    if (!copyTrade || !copyTrade.owner) {
      req.flash('error', 'User copy trade not found');
      return res.redirect('/user-copytrades');
    }

    // Check if amount and duration are non-empty
    if (!copyTrade.amount || !copyTrade.duration) {
      req.flash('error', 'Cannot delete copy trade: amount or duration is empty');
      return res.redirect('/user-copytrades');
    }

    // Remove from user's copyTrades array
    await User.updateMany(
      { copyTrades: copyTradeId },
      { $pull: { copyTrades: copyTradeId } }
    );

    // Delete the copy trade
    await CopyTrade.findByIdAndDelete(copyTradeId);

    req.flash('success', 'User copy trade deleted successfully');
    res.redirect('/user-copytrades');
  } catch (error) {
    console.error('Delete user copy trade error:', error);
    req.flash('error', `Error deleting user copy trade: ${error.message}`);
    res.redirect('/user-copytrades');
  }
};


// ******************************************** ALL WALLET CODES *****************************************//

// / Get all wallets
exports.getAllWalletsPage = async (req, res) => {
    try {
        const wallets = await Wallet.find().populate('owner', 'username');
        res.render('wallets', { wallets, messages: req.flash('success') });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error fetching wallets');
        res.redirect('/all-wallets');
    }
};

// Render add wallet page
exports.addWalletPage = (req, res) => {
    res.render('add-wallet');
};



exports.addWallet_post = async (req, res) => {
    try {
        const { btc_address, eth_address, usdt_address, cashapp, paypal } = req.body;
        const walletData = { btc_address, eth_address, usdt_address, cashapp, paypal };

        // Handle file uploads
        if (req.files) {
            if (req.files.btc_image && req.files.btc_image[0]) {
                const result = await cloudinary.uploader.upload(req.files.btc_image[0].path);
                walletData.btc_image = result.secure_url;
                fs.unlinkSync(req.files.btc_image[0].path);
            }
            if (req.files.eth_image && req.files.eth_image[0]) {
                const result = await cloudinary.uploader.upload(req.files.eth_image[0].path);
                walletData.eth_image = result.secure_url;
                fs.unlinkSync(req.files.eth_image[0].path);
            }
            if (req.files.usdt_image && req.files.usdt_image[0]) {
                const result = await cloudinary.uploader.upload(req.files.usdt_image[0].path);
                walletData.usdt_image = result.secure_url;
                fs.unlinkSync(req.files.usdt_image[0].path);
            }
            if (req.files.cashapp_image && req.files.cashapp_image[0]) {
                const result = await cloudinary.uploader.upload(req.files.cashapp_image[0].path);
                walletData.cashapp_image = result.secure_url;
                fs.unlinkSync(req.files.cashapp_image[0].path);
            }
            if (req.files.paypal_image && req.files.paypal_image[0]) {
                const result = await cloudinary.uploader.upload(req.files.paypal_image[0].path);
                walletData.paypal_image = result.secure_url;
                fs.unlinkSync(req.files.paypal_image[0].path);
            }
        }

        const wallet = new Wallet(walletData);
        await wallet.save();
        req.flash('success', 'Wallet added successfully');
        res.redirect('/all-wallets');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error adding wallet');
        res.redirect('/all-wallets');
    }
};

// Render edit wallet page
exports.editWalletPage = async (req, res) => {
    try {
        const wallet = await Wallet.findById(req.params.id);
        if (!wallet) {
            req.flash('error', 'Wallet not found');
            return res.redirect('/all-wallets');
        }
        res.render('edit-wallet', { wallet });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error fetching wallet');
        res.redirect('/all-wallets');
    }
};

// Handle edit wallet form submission
exports.updateWallet = async (req, res) => {
    try {
        const { btc_address, eth_address, usdt_address, cashapp, paypal } = req.body;
        const walletData = { btc_address, eth_address, usdt_address, cashapp, paypal };

        // Handle file uploads
        if (req.files) {
            if (req.files.btc_image) {
                const result = await cloudinary.uploader.upload(req.files.btc_image.path);
                walletData.btc_image = result.secure_url;
                fs.unlinkSync(req.files.btc_image.path);
            }
            if (req.files.eth_image) {
                const result = await cloudinary.uploader.upload(req.files.eth_image.path);
                walletData.eth_image = result.secure_url;
                fs.unlinkSync(req.files.eth_image.path);
            }
            if (req.files.usdt_image) {
                const result = await cloudinary.uploader.upload(req.files.usdt_image.path);
                walletData.usdt_image = result.secure_url;
                fs.unlinkSync(req.files.usdt_image.path);
            }
            if (req.files.cashapp_image) {
                const result = await cloudinary.uploader.upload(req.files.cashapp_image.path);
                walletData.cashapp_image = result.secure_url;
                fs.unlinkSync(req.files.cashapp_image.path);
            }
            if (req.files.paypal_image) {
                const result = await cloudinary.uploader.upload(req.files.paypal_image.path);
                walletData.paypal_image = result.secure_url;
                fs.unlinkSync(req.files.paypal_image.path);
            }
        }

        await Wallet.findByIdAndUpdate(req.params.id, walletData);
        req.flash('success', 'Wallet updated successfully');
        res.redirect('/all-wallets');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error updating wallet');
        res.redirect(`/edit-wallet/${req.params.id}`);
    }
};

// Delete wallet
exports.deleteWallet = async (req, res) => {
    try {
        await Wallet.findByIdAndDelete(req.params.id);
        req.flash('success', 'Wallet deleted successfully');
        res.redirect('/all-wallets');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error deleting wallet');
        res.redirect('/all-wallets');
    }
};

// ***************************************** ALL ADMIN VERIFICATION CODES ********************************//

module.exports.getAllVerifications = async (req, res) => {
    try {
        const verifications = await Verify.find().populate('owner', 'email username');
        res.render('verifications', { verifications }); // Create this view
    } catch (error) {
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
};

module.exports.viewVerification = async (req, res) => {
    try {
        const verification = await Verify.findById(req.params.id).populate('owner', 'email username');
        if (!verification) {
            return res.status(404).json({ error: 'Verification not found' });
        }
        res.render('verificationDetails', { verification }); // Create this view
    } catch (error) {
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
};



module.exports.deleteVerification = async (req, res) => {
    try {
      const id = req.params.id
        const verification = await Verify.findById(id);
        if (!verification) {
            console.error('Verification not found for ID:', id);
            return res.status(404).json({ error: 'Verification not found' });
        }

        // Delete images from Cloudinary (optional, continue even if it fails)
        if (verification.image) {
            try {
                const publicId = verification.image.split('/').pop().split('.')[0]; // Extract publicId
                await cloudinary.uploader.destroy(`verifications/front/${publicId}`);
                console.log(`Successfully deleted front image: verifications/front/${publicId}`);
            } catch (error) {
                console.error(`Error deleting front image from Cloudinary: verifications/front/${publicId}`, error);
            }
        }
        if (verification.backImage) {
            try {
                const publicId = verification.backImage.split('/').pop().split('.')[0]; // Extract publicId
                await cloudinary.uploader.destroy(`verifications/back/${publicId}`);
                console.log(`Successfully deleted back image: verifications/back/${publicId}`);
            } catch (error) {
                console.error(`Error deleting back image from Cloudinary: verifications/back/${publicId}`, error);
            }
        }

        // Update user's kycVerified status and remove verification from verified array
        const user = await User.findByIdAndUpdate(
            verification.owner,
            {
                $pull: { verified: verification._id },
                kycVerified: false
            },
            { new: true }
        );
        if (!user) {
            console.error('User not found for ID:', verification.owner);
            return res.status(404).json({ error: 'Associated user not found' });
        }

        // Delete the verification document
        await Verify.findByIdAndDelete(id);

        console.log(`Verification ${req.params.id} deleted successfully`);
        res.status(200).json({ message: 'Verification deleted successfully' });
    } catch (error) {
        console.error('Error in deleteVerification:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
};

// **************************************************************** ALL UPGRADE ADMIN CONTROLLERS*************************//

// / Fetch all upgrade requests
module.exports.allUpgrades = async (req, res) => {
    try {
        const upgrades = await Upgrade.find().populate('owner', 'fullname email username');
        res.render('all-accountUpgrade', {
            upgrades
        });
    } catch (error) {
        console.error('Error in allUpgrades:', error);
        res.status(500).send('Server error');
    }
};

module.exports.viewUpgrades = async(req, res)=>{
   try {
        const upgrade = await Upgrade.findById(req.params.id).populate('owner', 'email username');
        if (!upgrade) {
            return res.status(404).json({ error: 'Upgrade not found' });
        }
        res.render('viewUpgrade', { upgrade }); // Create this view
    } catch (error) {
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
}


// Delete an upgrade request
module.exports.deleteUpgrade = async (req, res) => {
    try {
        const upgradeId = req.params.id;
        const upgrade = await Upgrade.findById(upgradeId);
        if (!upgrade) {
            return res.status(404).json({ error: 'Upgrade request not found' });
        }

        // Delete image from Cloudinary
        if (upgrade.image) {
            const publicId = upgrade.image.split('/').pop().split('.')[0];
            try {
                await cloudinary.uploader.destroy(`upgrade_proofs/${publicId}`);
            } catch (cloudinaryError) {
                console.error('Error deleting image from Cloudinary:', cloudinaryError);
            }
        }

        // Remove upgrade from user's upgrades array
        const user = await User.findOne({ upgrades: upgradeId });
        if (user) {
            user.upgrades.pull(upgradeId);
            await user.save();
        }

        // Delete the upgrade request
        await Upgrade.deleteOne({ _id: upgradeId });

        res.status(200).json({ message: 'Upgrade request deleted successfully' });
    } catch (error) {
        console.error('Error in deleteUpgrade:', error);
        res.status(500).json({ error: 'Failed to delete upgrade request' });
    }
};

// *******************************************************Signal Admin Route ***********************************//

// Fetch all signal requests
module.exports.getAllSignals = async (req, res) => {
    try {
        const signals = await Signal.find().populate('owner', 'fullname email');
        res.render('allSignals', { signals }); // Render admin signals view
    } catch (error) {
        console.error('Error fetching signals:', error);
        res.status(500).render('error', { message: 'Failed to fetch signals' });
    }
};

// View a single signal request
module.exports.viewSignal = async (req, res) => {
    try {
        const signal = await Signal.findById(req.params.id).populate('owner', 'fullname email');
        if (!signal) {
            return res.status(404).render('error', { message: 'Signal not found' });
        }
        res.render('signal-detail', { signal });
    } catch (error) {
        console.error('Error viewing signal:', error);
        res.status(500).render('admin/error', { message: 'Failed to view signal' });
    }
};

// Delete a signal request
module.exports.deleteSignal = async (req, res) => {
    try {
        const signal = await Signal.findById(req.params.id);
        if (!signal) {
            return res.status(404).json({ error: 'Signal not found', type: 'error' });
        }
        await Signal.deleteOne({ _id: req.params.id });
        // Remove signal from user's signals array
        await User.updateOne(
            { _id: signal.owner },
            { $pull: { signals: signal._id } }
        );
        res.status(200).json({ message: 'Signal deleted successfully', type: 'success' });
    } catch (error) {
        console.error('Error deleting signal:', error);
        res.status(500).json({ error: 'Failed to delete signal', type: 'error' });
    }
};

// *******************************************all LIVE TRADE ADMIN CODE ***************************************//

// Fetch all live trades
module.exports.getAllTrades = async (req, res) => {
  try {
    const livetrades = await Livetrading.find().populate('owner', 'username email');
    res.render('trades', { livetrades });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error fetching trades');
    res.redirect('/adminRoute');
  }
};


// View a single trade
module.exports.viewTrade = async (req, res) => {
  try {
    const livetrade = await Livetrading.findById(req.params.id).populate('owner', 'username email');
    if (!livetrade) {
      req.flash('error', 'Trade not found');
      return res.redirect('/all-livetrade');
    }
    res.render('view-trade', { livetrade });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error viewing trade');
    res.redirect('/all-livetrade');
  }
};

// Edit a trade
module.exports.editTrade = async (req, res) => {
  try {
    const livetrade = await Livetrading.findById(req.params.id);
    if (!livetrade) {
      req.flash('error', 'Trade not found');
      return res.redirect('/all-livetrade');
    }
    res.render('edit-trade', { livetrade });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading edit page');
    res.redirect('/all-livetrade');
  }
};


module.exports.updateTrade = async (req, res) => {
    try {
        console.log('Received form data:', req.body); // Debug log
        const { trading_type, currency_pair, lot_size, entry_price, stop_loss, take_profit, trading_action, status } = req.body;
        const livetrade = await Livetrading.findById(req.params.id);
        if (!livetrade) {
            console.log('Trade not found for ID:', req.params.id); // Debug log
            req.flash('error', 'Trade not found');
            return res.redirect('/all-livetrade');
        }

        // Validate fields
        if (!trading_type || !['CRYPTOCURRENCY', 'FOREX', 'Margin Trade'].includes(trading_type)) {
            console.log('Invalid trading_type:', trading_type); // Debug log
            req.flash('error', 'Invalid trading type');
            return res.redirect(`/trades-edit/${req.params.id}`);
        }
        if (!currency_pair) {
            console.log('Missing currency_pair'); // Debug log
            req.flash('error', 'Currency pair is required');
            return res.redirect(`/trades-edit/${req.params.id}`);
        }
        if (!lot_size || isNaN(lot_size) || parseFloat(lot_size) <= 0) {
            console.log('Invalid lot_size:', lot_size); // Debug log
            req.flash('error', 'Lot size must be a positive number');
            return res.redirect(`/trades-edit/${req.params.id}`);
        }
        if (!entry_price || isNaN(entry_price) || parseFloat(entry_price) <= 0) {
            console.log('Invalid entry_price:', entry_price); // Debug log
            req.flash('error', 'Entry price must be a positive number');
            return res.redirect(`/trades-edit/${req.params.id}`);
        }
        if (!stop_loss || isNaN(stop_loss) || parseFloat(stop_loss) <= 0) {
            console.log('Invalid stop_loss:', stop_loss); // Debug log
            req.flash('error', 'Stop loss must be a positive number');
            return res.redirect(`/trades-edit/${req.params.id}`);
        }
        if (!take_profit || isNaN(take_profit) || parseFloat(take_profit) <= 0) {
            console.log('Invalid take_profit:', take_profit); // Debug log
            req.flash('error', 'Take profit must be a positive number');
            return res.redirect(`/trades-edit/${req.params.id}`);
        }
        if (!trading_action || !['BUY', 'SELL'].includes(trading_action)) {
            console.log('Invalid trading_action:', trading_action); // Debug log
            req.flash('error', 'Invalid trading action');
            return res.redirect(`/trades-edit/${req.params.id}`);
        }
        if (!status || !['Open', 'Closed'].includes(status)) {
            console.log('Invalid status:', status); // Debug log
            req.flash('error', 'Invalid status');
            return res.redirect(`/trades-edit/${req.params.id}`);
        }

        // Update fields
        livetrade.type = trading_type;
        livetrade.currencypair = currency_pair;
        livetrade.lotsize = lot_size;
        livetrade.entryPrice = entry_price;
        livetrade.stopLoss = stop_loss;
        livetrade.takeProfit = take_profit;
        livetrade.action = trading_action;
        livetrade.status = status;

        await livetrade.save();
        console.log('Trade saved:', livetrade); // Debug log

        req.flash('success', 'Trade updated successfully');
        console.log('Redirecting to /all-livetrade'); // Debug log
        res.redirect('/all-livetrade');
    } catch (err) {
        console.error('Error in updateTrade:', err); // Debug log
        req.flash('error', 'Error updating trade');
        res.redirect(`/trades-edit/${req.params.id}`);
    }
};

module.exports.deleteTrade = async (req, res) => {
  try {
    const livetrade = await Livetrading.findById(req.params.id);
    if (!livetrade) {
      req.flash('error', 'Trade not found');
      return res.redirect('/all-livetrade');
    }

    // Remove trade from user's livetrades
    await User.updateOne(
      { _id: livetrade.owner },
      { $pull: { livetrades: livetrade._id } }
    );

    // Replace livetrade.remove() with Livetrading.deleteOne()
    await Livetrading.deleteOne({ _id: livetrade._id });
    
    req.flash('success', 'Trade deleted successfully');
    res.redirect('/all-livetrade');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error deleting trade');
    res.redirect('/all-livetrade');
  }
};

// **************************************Stock Trade Admin Controller code ********************************//


// Get all stock trades
module.exports.getAllStockTrades = async (req, res) => {
  try {
    const stocktrades = await stockTrade.find().populate('owner', 'fullname email');
    res.render('stocktrades', { stocktrades });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error fetching stock trades');
    res.redirect('/adminRoute');
  }
};

// View a single stock trade
module.exports.viewStockTrade = async (req, res) => {
  try {
    const trade = await stockTrade.findById(req.params.id).populate('owner', 'fullname email');
    if (!trade) {
      req.flash('error', 'Trade not found');
      return res.redirect('/all-tradestock');
    }
    res.render('view-stocktrade', { trade });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error viewing trade');
    res.redirect('/all-tradestock');
  }
};

// Edit a stock trade
module.exports.editStockTrade = async (req, res) => {
  try {
    const { type, amount, action, status } = req.body;
    const trade = await stockTrade.findById(req.params.id);
    if (!trade) {
      req.flash('error', 'Trade not found');
      return res.redirect('/all-tradestock');
    }

    trade.type = type || trade.type;
    trade.amount = parseFloat(amount) || trade.amount;
    trade.action = action || trade.action;
    trade.status = status || trade.status;

    await trade.save();
    req.flash('success', 'Trade updated successfully');
    res.redirect('/all-tradestock');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error updating trade');
    res.redirect('/all-tradestock');
  }
};

// Delete a stock trade
module.exports.deleteStockTrade = async (req, res) => {
  try {
    const trade = await stockTrade.findById(req.params.id);
    if (!trade) {
      req.flash('error', 'Trade not found');
      return res.redirect('/all-tradestock');
    }

    // Remove trade from user's stocktrades
    await User.updateOne(
      { _id: trade.owner },
      { $pull: { stocktrades: trade._id } }
    );

    // Delete the trade
    await stockTrade.deleteOne({ _id: trade._id });

    req.flash('success', 'Trade deleted successfully');
    res.redirect('/all-tradestock');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error deleting trade');
    res.redirect('/all-tradestock');
  }
};