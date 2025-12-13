// userController.js

const mongoose = require('mongoose');
const User = require('../Model/User');
const CopyTrade = require('../Model/CopyTrade');
const Wallet = require("../Model/walletAddress")
const Deposit = require("../Model/depositSchema")
const Withdraw = require("../Model/widthdrawSchema")
const Verify  = require("../Model/verifySchema")
const Upgrade = require("../Model/upgradeSchema")
const Signal = require("../Model/signal")
const Livetrading = require("../Model/livetradingSchema")
const stockTrade   = require("../Model/stockTrade")
const Affliate = require("../Model/affiliate")
const Chat = require('../Model/Chat');
const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const crypto = require('crypto');
const validator = require('validator');
const fs = require('fs');
const fsPromises = require('fs').promises;
const cloudinary = require('cloudinary').v2;
const Notification = require('../Model/Notification'); // New import
// const PushSubscription = require('../Model/PushSubscription'); // New
// const webpush = require('web-push'); // New



// Configure Cloudinary (add your credentials in .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
// Generate verification URL dynamically
// const generateVerificationUrl = (userId, verificationToken) => {
//   const baseUrl = process.env.BASE_URL;
//   return `${baseUrl}/verify-email?user=${userId}&ver_code=${verificationToken}`;
// };

// Send verification email
// const sendVerificationEmail = async (email, fullname, verificationToken, userId) => {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//     user: 'digitaltopfigmairkets@gmail.com',
//       pass: 'jgscqjhzpsulnagz'
//     }
//   });

//   const verificationUrl = generateVerificationUrl(userId, verificationToken);

//   const mailOptions = {
//     from: 'support@digital-topfigmairkets.com', // Update to match your domain
//     to: email,
//     subject: 'Verify Your Email - Digital Figtop',
//     html: `
//       <div style="background-color: #1C2526; padding: 20px; font-family: Arial, sans-serif; color: #F5F6F5; text-align: center; max-width: 600px; margin: 0 auto;">
//         <!-- Header -->
//         <div style="background-color: #2E3A3B; padding: 15px; border-bottom: 2px solid #F5F6F5;">
//           <img src="https://ci3.googleusercontent.com/meips/ADKq_NbWvndY7ipL-Nw8Hmdp3YA_hWPJyT9lZ-TMEC-sIUnu2jcyRInbm0Y0JFSMU-KNB5MRgIwNfml_cVYKSqj0543VjAghNO6rZA=s0-d-e1-ft#https://digital-figtopmarkets.com/images/email.png" alt="Digital Figtop Logo" style="max-width: 150px; height: auto; display: block; margin: 0 auto;">
//           <h2 style="color: #F5F6F5; margin: 10px 0 0; font-size: 24px;">Verify Your Email Account</h2>
//         </div>
//         <!-- Body -->
//         <div style="padding: 20px; font-size: 16px; line-height: 1.5;">
//           <p>Hi ${fullname},</p>
//           <p style="color: #F5F6F5;">Thanks for creating an account with us at Digital Figtop. Please click the button below to verify your account:</p>
//           <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3F3EED; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">Confirm Email</a>
//           <p style="color: #F5F6F5;">If the button above doesn't work, please copy and paste this link into your browser:</p>
//           <p><a href="${verificationUrl}" style="color: #4A90E2; text-decoration: none;">${verificationUrl}</a></p>
//           <!-- Contact/Support Links in Body -->
//           <div style="margin: 20px 0; display: flex; justify-content: center; gap: 20px;">
//             <a href="mailto:support@digital-topfigmairkets.com" style="color: #4A90E2; text-decoration: none; display: flex; align-items: center; gap: 5px;">
//               <img src="https://img.icons8.com/ios-filled/24/4A90E2/email.png" alt="Email Icon" style="width: 20px; height: 20px;">
//               <span>Contact Support</span>
//             </a>
//             <a href="digital-topfigmarkets.com" style="color: #4A90E2; text-decoration: none; display: flex; align-items: center; gap: 5px;">
//               <img src="https://img.icons8.com/ios-filled/24/4A90E2/globe.png" alt="Website Icon" style="width: 20px; height: 20px;">
//               <span>Visit Website</span>
//             </a>
//           </div>
//         </div>
//         <!-- Footer -->
//         <div style="background-color: #2E3A3B; padding: 15px; border-top: 2px solid #F5F6F5; font-size: 14px;">
//           <p style="margin: 0 0 10px; color: #F5F6F5;">© ${new Date().getFullYear()} Digital Figtop. All rights reserved.</p>
//           <div style="display: flex; justify-content: center; gap: 20px;">
//             <a href="mailto:support@digital-topfigmairkets.com" style="color: #4A90E2; text-decoration: none; display: flex; align-items: center; gap: 5px;">
//               <img src="https://img.icons8.com/ios-filled/24/4A90E2/email.png" alt="Email Icon" style="width: 20px; height: 20px;">
//               <span>Contact Support</span>
//             </a>
//             <a href="digital-topfigmairkets.com" style="color: #4A90E2; text-decoration: none; display: flex; align-items: center; gap: 5px;">
//               <img src="https://img.icons8.com/ios-filled/24/4A90E2/globe.png" alt="Website Icon" style="width: 20px; height: 20px;">
//               <span>Visit Website</span>
//             </a>
//           </div>
//         </div>
//       </div>
//     `
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('Verification email sent to:', email);
//   } catch (error) {
//     console.error('Error sending verification email:', error);
//     throw error; // Re-throw to be caught in registerPage_post
//   }
// };

// Send welcome email after verification
// const sendWelcomeEmail = async (email, fullname, username, password, createdAt) => {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//        user: 'digitaltopfigmairkets@gmail.com',
//       pass: 'jgscqjhzpsulnagz'
//     }
//   });

//   const signInUrl = process.env.BASE_URL;

//   const mailOptions = {
//     from: 'support@digital-topfigmairkets.com',
//     to: email,
//     subject: 'Welcome to Digital Figtop',
//     html: `
//       <div style="background-color: #1C2526; padding: 20px; font-family: Arial, sans-serif; color: #F5F6F5; text-align: center; max-width: 600px; margin: 0 auto;">
//         <!-- Header -->
//         <div style="background-color: #2E3A3B; padding: 15px; border-bottom: 2px solid #F5F6F5;">
//           <img src="https://ci3.googleusercontent.com/meips/ADKq_NbWvndY7ipL-Nw8Hmdp3YA_hWPJyT9lZ-TMEC-sIUnu2jcyRInbm0Y0JFSMU-KNB5MRgIwNfml_cVYKSqj0543VjAghNO6rZA=s0-d-e1-ft#https://digital-figtopmarkets.com/images/email.png" alt="Digital Figtop Logo" style="max-width: 150px; height: auto; display: block; margin: 0 auto;">
//           <h2 style="color: #F5F6F5; margin: 10px 0 0; font-size: 24px;">Welcome, ${fullname}</h2>
//         </div>
//         <!-- Body -->
//         <div style="padding: 20px; font-size: 16px; line-height: 1.5;">
//           <h3 style="color: #F5F6F5; font-size: 18px;">We are happy to have you join us</h3>
//           <p style="color: #F5F6F5;">Your account registration and email verification was successful. Welcome to Digital Figtop.</p>
//           <p style="color: #F5F6F5; font-weight: bold;">Below is your personal details. Do not disclose to anyone.</p>
//           <hr style="border: 1px solid #4A4A4A; margin: 20px 0;">
//           <p style="color: #F5F6F5; text-align: left; margin: 10px 0;"><strong>Username:</strong> ${username}</p>
//           <p style="color: #F5F6F5; text-align: left; margin: 10px 0;"><strong>Email:</strong> ${email}</p>
//           <p style="color: #F5F6F5; text-align: left; margin: 10px 0;"><strong>Password:</strong> ${password}</p>
//           <hr style="border: 1px solid #4A4A4A; margin: 20px 0;">
//           <a href="${signInUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3F3EED; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">Sign In</a>
//           <p style="color: #F5F6F5; font-size: 14px;">Account created on: ${new Date(createdAt).toLocaleDateString()}</p>
//         </div>
//         <!-- Footer -->
//         <div style="background-color: #2E3A3B; padding: 15px; border-top: 2px solid #F5F6F5; font-size: 14px;">
//           <p style="margin: 0 0 10px; color: #F5F6F5;">© ${new Date().getFullYear()} Digital Figtop. All rights reserved.</p>
//           <div style="display: flex; justify-content: center; gap: 20px;">
//             <a href="mailto:support@digital-topfigmairkets.com" style="color: #4A90E2; text-decoration: none; display: flex; align-items: center; gap: 5px;">
//               <img src="https://img.icons8.com/ios-filled/24/4A90E2/email.png" alt="Email Icon" style="width: 20px; height: 20px;">
//               <span>Contact Support</span>
//             </a>
//             <a href="digital-topfigmairkets.com" style="color: #4A90E2; text-decoration: none; display: flex; align-items: center; gap: 5px;">
//               <img src="https://img.icons8.com/ios-filled/24/4A90E2/globe.png" alt="Website Icon" style="width: 20px; height: 20px;">
//               <span>Visit Website</span>
//             </a>
//           </div>
//         </div>
//       </div>
//     `
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('Welcome email sent to:', email);
//   } catch (error) {
//     console.error('Error sending welcome email:', error);
//     throw error; // Re-throw to handle in verifyEmail
//   }
// };

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
  } else if (err.message === 'Your account is suspended. If you believe this is a mistake, please contact support at support@digitalmarkets-topfig.com') {
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

// Routes
module.exports.indexPage = (req, res) => {
  res.render("index");
};

module.exports.aboutPage = (req, res) => {
  res.render("about");
};

module.exports.contactPage = (req, res) => {
  res.render("contact");
};

module.exports.privacyPage = (req, res) => {
  res.render("faq");
};

module.exports.termsPage = (req, res) => {
  res.render("index");
};

module.exports.registerPage = (req, res) => {
  res.render("register");
};

module.exports.registerPage_post = async (req, res) => {
  const {
    fullname,
    username,
    email,
    tel,
    country,
    zip_code,
    city,
    currency,
    password1,
    password2,
    address
  } = req.body;

  try {
    // Validation checks
    if (
      !fullname || !username || !email || !tel || !country || !city || !currency || !password1 || !password2
    ) {
      throw Error('All fields are required');
    }

    if (password1 !== password2) {
      throw Error('Passwords do not match');
    }

    if (!validator.isEmail(email)) {
      throw Error('Invalid email format');
    }

    const user = new User({
      fullname,
      username,
      email,
      tel,
      country,
      zip_code: zip_code || 'None',
      city,
      currency,
      password: password1,
      address: address || 'None',
    });


    const savedUser = await user.save();
    console.log('User saved:', savedUser);

    // Create JWT token and set cookie
    const token = createToken(savedUser._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

    req.flash('success', 'Registration successful!');
    res.status(201).json({ redirect: '/dashboard' });

  } catch (err) {
    console.error('Registration error:', err);
    const errors = handleErrors(err);
    console.error('Mapped errors:', errors);
    res.status(400).json({ errors });
  }
};

// module.exports.verifyEmail = async (req, res) => {
//   const { user, ver_code } = req.query;

//   try {
//     const foundUser = await User.findById(user);
    
//     if (!foundUser) {
//       req.flash('error', 'Invalid verification link. Please create a new account.');
//       return res.redirect('/signup');
//     }

//     if (foundUser.isVerified) {
//       req.flash('success', 'Your account is already verified. Please login.');
//       return res.redirect('/signin');
//     }

//     if (foundUser.verificationToken !== ver_code) {
//       req.flash('error', 'Invalid verification code. Please create a new account.');
//       return res.redirect('/signup');
//     }

//     if (foundUser.verificationTokenExpires < Date.now()) {
//       req.flash('error', 'Verification link has expired. Please create a new account.');
//       return res.redirect('/signup');
//     }

//     // Verify the user
//     foundUser.isVerified = true;
//     foundUser.verificationToken = null;
//     foundUser.verificationTokenExpires = null;
//     await foundUser.save();

//     // Send welcome email
//     try {
//       await sendWelcomeEmail(
//         foundUser.email,
//         foundUser.fullname,
//         foundUser.username,
//         foundUser.password, // Note: Sending plain text password (consider security implications)
//         foundUser.createdAt
//       );
//       console.log('Welcome email sent to:', foundUser.email);
//     } catch (emailError) {
//       console.error('Failed to send welcome email:', emailError);
//       // Continue with verification success even if welcome email fails
//     }

//     req.flash('success', 'Account successfully verified! Please login.');
//     res.redirect('/signin');

//   } catch (err) {
//     console.error('Verification error:', err);
//     req.flash('error', 'An error occurred during verification. Please try again or create a new account.');
//     res.redirect('/signup');
//   }
// };

// Other routes remain unchanged
module.exports.loginPage = (req, res) => {
  res.render("login");
};

module.exports.loginPage_post = async(req, res) => {
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
        res.status(400).json({ errors, redirect: '/login' });
    }
};

module.exports.loginAdmin = (req, res) => {
  res.render('loginAdmin');
};

// New: Function to send push notification
// async function sendPushNotification(userId, notification) {
//   try {
//     const subscriptions = await PushSubscription.find({ user: userId });
//     if (subscriptions.length === 0) {
//       console.log('No push subscriptions found for user:', userId);
//       return;
//     }

//     const payload = JSON.stringify({
//       title: notification.title,
//       body: notification.message,
//       icon: '/images/logo.svg', // Adjust path as needed
//       badge: '/images/badge.png', // Adjust path as needed
//       data: { notificationId: notification._id }
//     });

//     const promises = subscriptions.map(sub => 
//       webpush.sendNotification(sub, payload).catch(error => {
//         console.error('Error sending push to subscription:', error);
//         // Optionally delete invalid subscription
//         if (error.statusCode === 410 || error.statusCode === 404) {
//           return PushSubscription.deleteOne({ _id: sub._id });
//         }
//       })
//     );

//     await Promise.all(promises);
//     console.log('Push notifications sent for notification:', notification._id);
//   } catch (error) {
//     console.error('Error in sendPushNotification:', error);
//   }
// }

module.exports.dashboardPage = (req, res) => {
  res.render('dashboard',{ vapidPublicKey: process.env.VAPID_PUBLIC_KEY });
};

// ********************************start of chat controller *******************************************//

module.exports.chatPage = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.redirect('/signin');
    }
    const chat = await Chat.findOne({ user: user._id }).populate('user');
    res.render('chat', { user, chat: chat || { messages: [] } });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong!');
    res.redirect('back');
  }
};

module.exports.chatPage_post = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.redirect('/signin');
    }
    const { content } = req.body;
    let imageUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    let chat = await Chat.findOne({ user: user._id });
    if (!chat) {
      chat = new Chat({ user: user._id, messages: [] });
    }

    const message = {
      sender: 'user',
      content,
      image: imageUrl,
      timestamp: new Date(),
    };

    chat.messages.push(message);
    await chat.save();

    // Emit message via Socket.IO
    req.app.get('io').to(user._id.toString()).emit('newMessage', message);
    req.app.get('io').to('admin').emit('newMessage', { userId: user._id, message });

    res.redirect('/chat');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong!');
    res.redirect('back');
  }
};

// *********************************** end of chat controller **************************************//

module.exports.verifyPage = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render("verify", { user, kycVerified: user.kycVerified });
    } catch (error) {
        res.status(500).send('Server error');
    }
};


module.exports.verifyPage_post = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        if (user.kycVerified) {
            return res.status(400).json({ error: 'User already verified' });
        }

        const {
            email, username, fullname, city, gender, dob,
            marital_status, age, address
        } = req.body;

        // Log the received form data for debugging
        console.log('Received form data:', {
            email, username, fullname, city, gender, dob,
            marital_status, age, address
        });

        // Validate required fields (allow non-empty strings)
        if (!email?.trim() || !username?.trim() || !fullname?.trim() || !city?.trim() || !gender?.trim() || !dob?.trim() || !marital_status?.trim() || !age?.trim() || !address?.trim()) {
            return res.status(400).json({ error: 'All fields are required and must not be empty' });
        }

        // Handle file uploads
        if (!req.files['idcardFront'] || !req.files['idcardBack']) {
            return res.status(400).json({ error: 'Both ID card images are required' });
        }

        // Get file paths from Multer disk storage
        const frontFilePath = req.files['idcardFront'][0].path;
        const backFilePath = req.files['idcardBack'][0].path;

        let idcardFront = null;
        let idcardBack = null;

        // Upload front ID to Cloudinary
        try {
            const frontResult = await cloudinary.uploader.upload(frontFilePath, {
                folder: 'verifications/front',
                resource_type: 'image'
            });
            idcardFront = frontResult.secure_url;
            fs.unlinkSync(frontFilePath); // Delete local file
        } catch (error) {
            console.error('Error uploading front ID to Cloudinary:', error);
            fs.unlinkSync(frontFilePath); // Delete local file on error
            return res.status(500).json({ error: 'Failed to upload front ID image' });
        }

        // Upload back ID to Cloudinary
        try {
            const backResult = await cloudinary.uploader.upload(backFilePath, {
                folder: 'verifications/back',
                resource_type: 'image'
            });
            idcardBack = backResult.secure_url;
            fs.unlinkSync(backFilePath); // Delete local file
        } catch (error) {
            console.error('Error uploading back ID to Cloudinary:', error);
            fs.unlinkSync(backFilePath); // Delete local file on error
            return res.status(500).json({ error: 'Failed to upload back ID image' });
        }

        // Log the Cloudinary URLs for debugging
        console.log('Cloudinary URLs:', { idcardFront, idcardBack });

        // Create new verification document
        const verification = new Verify({
            email,
            username,
            fullname,
            city,
            gender,
            dateofBirth: dob,
            marital: marital_status,
            age,
            address,
            image: idcardFront,
            backImage: idcardBack,
            owner: user._id
        });

        await verification.save();

        // Update user's verified array and kycVerified status
        user.verified.push(verification._id);
        user.kycVerified = true;
        await user.save();

        // New: Create verification notification for user
        const verificationNotification = new Notification({
          user: user._id,
          title: 'Verification Submitted',
          message: 'Your KYC verification has been submitted successfully.',
          type: 'verification_created'
        });
        await verificationNotification.save();

        // New: Send push notification
        // await sendPushNotification(user._id, verificationNotification);

        req.io.to(`notifications_${user._id}`).emit('newNotification', verificationNotification);

        // New: Notify admin of new verification
        const adminNotification = new Notification({
          user: null, // Admin notification, user null
          title: 'New Verification Request',
          message: `New verification from ${user.fullname}`,
          type: 'verification_created'
        });
        await adminNotification.save();
        req.io.to('admin').emit('newNotification', adminNotification);

        res.status(200).json({ message: 'Verification submitted successfully' });
    } catch (error) {
        console.error('Error in verifyPage_post:', error);
        // Attempt to clean up any files in case of error
        if (req.files['idcardFront']) {
            fs.unlinkSync(req.files['idcardFront'][0].path);
        }
        if (req.files['idcardBack']) {
            fs.unlinkSync(req.files['idcardBack'][0].path);
        }
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
};



module.exports.depositPage = async (req, res) => {
    try {
        const wallet = await Wallet.findOne(); // Fetch wallet details
        res.render('deposit', { wallet });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error loading deposit page');
        res.render('deposit', { wallet: null, });
    }
};

module.exports.depositPage_post = async (req, res) => {
    try {
        const { id } = req.params;
        const { depositmethod, amount } = req.body;

        // Validate inputs
        if (!depositmethod) {
            return res.status(400).json({ error: 'Please select a payment method.' });
        }
        if (!amount || isNaN(amount) || parseFloat(amount) < 5) {
            return res.status(400).json({ error: 'Amount must be at least $5.' });
        }

        // Store deposit data in session
        req.session.deposit = { type: depositmethod, amount };

        res.status(200).json({ success: true, message: 'Deposit initiated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports.paymentPage = async (req, res) => {
    try {
        const { type, amount } = req.session.deposit || {};
        if (!type || !amount) {
            req.flash('error', 'No deposit data found.');
            return res.redirect('/deposit');
        }
        const wallet = await Wallet.findOne(); // Fetch wallet details
        res.render('payment', { wallet, depositType: type, depositAmount: amount });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error loading payment page');
        res.redirect('/deposit');
    }
};

module.exports.paymentPage_post = async (req, res) => {
    try {
        const { id } = req.params;
        const { narration } = req.body;
        const { type, amount } = req.session.deposit || {};

        // Validate session data
        if (!type || !amount) {
            return res.status(400).json({ error: 'No deposit data found.' });
        }

        // Find user
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Validate file upload
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a proof of payment.' });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
        fs.unlinkSync(req.file.path); // Delete local file

        // Create deposit
        const deposit = new Deposit({
            type,
            amount,
            image: result.secure_url,
            narration: narration || 'Payment',
            owner: user._id
        });

        // Save deposit
        await deposit.save();

        // Update user's deposits
        user.deposits.push(deposit._id);
        await user.save();

        // New: Create deposit notification for user
        const depositNotification = new Notification({
          user: user._id,
          title: 'Deposit Submitted',
          message: `Your deposit of ${amount} ${type} has been submitted.`,
          type: 'deposit_created'
        });
        await depositNotification.save();

        // New: Send push notification
        // await sendPushNotification(user._id, depositNotification);

        req.io.to(`notifications_${user._id}`).emit('newNotification', depositNotification);

        // New: Notify admin of new deposit
        const adminNotification = new Notification({
          user: null,
          title: 'New Deposit Request',
          message: `New deposit from ${user.fullname} for ${amount} ${type}`,
          type: 'deposit_created'
        });
        await adminNotification.save();
        req.io.to('admin').emit('newNotification', adminNotification);

        // Clear session data
        req.session.deposit = null;

        // Success response
        res.status(200).json({ success: true, message: 'Deposit submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error submitting deposit' });
    }
}



module.exports.withdrawPage = (req, res) => {
  res.render("withdraw");
};



module.exports.withdrawPage_post = async (req, res) => {
    try {
        // Extract id from req.params
        const id = req.params.id;

        // Validate id
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            req.flash('error', 'Invalid user ID');
            return res.redirect('/withdraw');
        }

        // Find user by ID
        const user = await User.findById(id);
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/withdraw');
        }

        // Extract form data
        const { 
            withdrawalmethod, 
            amount, 
            narration, 
            bitcoin_address, 
            ethereum_address, 
            usdt_address, 
            cashapp_tag, 
            paypal_email, 
            bank_name, 
            account_number, 
            country, 
            swift_code 
        } = req.body;

        // Validate balance
        const availableBalance = parseFloat(user.available);
        const withdrawalAmount = parseFloat(amount);

        if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
            req.flash('error', 'Invalid withdrawal amount');
            return res.redirect('/withdraw');
        }

        if (withdrawalAmount > availableBalance) {
            req.flash('error', 'Insufficient balance for withdrawal');
            return res.redirect('/withdraw');
        }

        // Check verification status for withdrawal limits
        const maxUnverifiedLimit = 300;
        if (user.verifiedStatus === 'not Verified!' && withdrawalAmount > maxUnverifiedLimit) {
            req.flash('error', `Unverified accounts can only withdraw up to $${maxUnverifiedLimit}. Please complete your verification to withdraw larger amounts.`);
            return res.redirect('/withdraw');
        }

        // Prepare withdrawal data
        const withdrawData = {
            amount: withdrawalAmount,
            type: withdrawalmethod,
            narration,
            owner: user._id,
        };

        // Add method-specific fields
        if (withdrawalmethod === 'Bitcoin') {
            withdrawData.walletAddress = bitcoin_address;
        } else if (withdrawalmethod === 'Ethereum') {
            withdrawData.walletAddress = ethereum_address;
        } else if (withdrawalmethod === 'USDT') {
            withdrawData.walletAddress = usdt_address;
        } else if (withdrawalmethod === 'CashApp') {
            withdrawData.cashAppTag = cashapp_tag;
        } else if (withdrawalmethod === 'PayPal') {
            withdrawData.paypalEmail = paypal_email;
        } else if (withdrawalmethod === 'Bank Transfer') {
            withdrawData.bankDetails = {
                bankName: bank_name,
                accountNumber: account_number,
                country,
                swiftCode: swift_code,
            };
        }

        // Create and save withdrawal
        const withdrawal = new Withdraw(withdrawData);
        await withdrawal.save();

        // Update user balance and withdrawals array
        user.available = (availableBalance - withdrawalAmount).toFixed(2);
        user.withdraws.push(withdrawal._id);
        await user.save();

        // New: Create withdrawal notification for user
        const withdrawalNotification = new Notification({
          user: user._id,
          title: 'Withdrawal Submitted',
          message: `Your withdrawal of ${amount} ${withdrawalmethod} has been submitted.`,
          type: 'withdrawal_created'
        });
        await withdrawalNotification.save();

        // New: Send push notification
        // await sendPushNotification(user._id, withdrawalNotification);

        req.io.to(`notifications_${user._id}`).emit('newNotification', withdrawalNotification);

        // New: Notify admin of new withdrawal
        const adminNotification = new Notification({
          user: null,
          title: 'New Withdrawal Request',
          message: `New withdrawal from ${user.fullname} for ${amount} ${withdrawalmethod}`,
          type: 'withdrawal_created'
        });
        await adminNotification.save();
        req.io.to('admin').emit('newNotification', adminNotification);

        // Success response
        req.flash('success', 'Withdrawal request submitted successfully');
        res.redirect(`/transactions/${id}`); // Fixed redirect URL
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message).join(', ');
            req.flash('error', `Validation error: ${messages}`);
        } else {
            req.flash('error', 'Error submitting withdrawal request');
        }
        res.redirect('/withdraw');
    }
};





module.exports.transactionsPage = async (req, res) => {
    try {
        const id = req.params.id;
        console.log('Fetching user with ID:', id);

        const user = await User.findById(id)
            .populate('deposits') // Populate deposits, matching depositHistory logic
            .populate('withdraws'); // Populate withdraws, matching schema field name

        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/dashboard'); // Redirect to avoid rendering with null user
        }

        res.render('transactions', { 
            messages: req.flash(),
            user
        });
    } catch (error) {
        console.error('Error in transactionsPage:', error);
        req.flash('error', 'Error fetching transactions');
        res.redirect('/dashboard'); // Redirect on error
    }
};

module.exports.affiliatePage = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).populate('affliates').lean();
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/dashboard');
    }
    res.render('affiliate', { user, success: req.flash('success'), error: req.flash('error') });
  } catch (error) {
    console.error('Error in affiliatePage:', error);
    req.flash('error', 'Failed to load affiliate page');
    res.redirect('/dashboard');
  }
};

module.exports.affiliatePage_post = async (req, res) => {
  try {
    const { aff_plan_id, amount } = req.body;
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect(`/page/${userId}`);
    }

    // Define affiliate plans
    const plans = [
      { id: '3', type: 'affiliate tier bot', min: 100, max: 1000, growth: '500% Daily Growth', roi: '10550%', duration: '3 days' },
      { id: '4', type: 'affiliate tier bot niche', min: 2000, max: 10000, growth: '1000% Daily Growth', roi: '50000%', duration: '10 days' },
      { id: '5', type: 'affiliate tier bot ecommerce', min: 5000, max: 100000, growth: '5000% Daily Growth', roi: '5500%', duration: '31 days' }
    ];

    const plan = plans.find(p => p.id === aff_plan_id);
    if (!plan) {
      req.flash('error', 'Invalid affiliate plan');
      return res.redirect(`/page/${userId}`);
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < plan.min || amountNum > plan.max) {
      req.flash('error', `Amount must be between $${plan.min.toFixed(2)} and $${plan.max.toFixed(2)}`);
      return res.redirect(`/page/${userId}`);
    }

    const availableBalance = parseFloat(user.available);
    if (availableBalance < amountNum) {
      req.flash('error', 'Insufficient available balance');
      return res.redirect(`/page/${userId}`);
    }

    // Deduct from available balance
    user.available = (availableBalance - amountNum).toFixed(2);
    await user.save();

    // Create affiliate record
    const affiliate = new Affliate({
      amount: amountNum.toFixed(2),
      type: plan.type,
      roi: plan.roi,
      duration: plan.duration,
      owner: [userId]
    });
    await affiliate.save();

    // Update user's affiliates
    user.affliates.push(affiliate._id);
    await user.save();

    req.flash('success', 'Affiliate plan purchased successfully');
    res.redirect(`/page/${userId}`);
  } catch (error) {
    console.error('Error in affiliatePage_post:', error);
    req.flash('error', 'Failed to purchase affiliate plan');
    res.redirect(`/page/${req.params.id}`);
  }
};

module.exports.getAffiliates = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('affliates').lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.affliates || []);
  } catch (error) {
    console.error('Error in getAffiliates:', error);
    res.status(500).json({ error: 'Failed to fetch affiliates' });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error in getUser:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};


module.exports.upgradePage = async (req, res) => {
    try {
      // const id = req.params.id
      //   const user = await User.findById(id);
        const wallet = await Wallet.findOne(); // Adjust query based on your Wallet model
        res.render('upgrade', {
            wallet
        });
    } catch (error) {
        console.error('Error in upgradePage:', error);
        res.status(500).send('Server error');
    }3
};

module.exports.upgradePage_post = async (req, res) => {
    try {
        const id = req.params.id;
        const { upgraderequest, paymentmethod, amount, narration } = req.body;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Validate amount against user.available
        const availableBalance = parseFloat(user.available);
        const requestedAmount = parseFloat(amount);
        if (isNaN(requestedAmount) || requestedAmount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }
        if (requestedAmount > availableBalance) {
            return res.status(400).json({ error: `Insufficient balance. Available: €${availableBalance}` });
        }

        // Validate inputs
        if (!upgraderequest || !paymentmethod || !narration) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Upload proof of payment to Cloudinary
        let imageUrl = '';
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'upgrade_proofs'
            });
            imageUrl = result.secure_url;
        } else {
            return res.status(400).json({ error: 'Proof of payment is required' });
        }

        // Create new upgrade request
        const upgrade = new Upgrade({
            upgraderequest,
            amount: requestedAmount.toString(),
            method: paymentmethod,
            status: 'pending',
            image: imageUrl,
            owner: user._id // Link to user
        });
        await upgrade.save();

        // Deduct the amount from user's available balance
        const newBalance = (availableBalance - requestedAmount).toFixed(2); // Ensure 2 decimal places
        user.available = newBalance.toString(); // Convert back to string as per schema

        // Link upgrade to user
        user.upgrades.push(upgrade._id);
        await user.save();

        // New: Create upgrade notification for user
        const upgradeNotification = new Notification({
          user: user._id,
          title: 'Upgrade Request Submitted',
          message: `Your upgrade request for ${amount} has been submitted.`,
          type: 'upgrade_created'
        });
        await upgradeNotification.save();

        // New: Send push notification
        // await sendPushNotification(user._id, upgradeNotification);

        req.io.to(`notifications_${user._id}`).emit('newNotification', upgradeNotification);

        // New: Notify admin of new upgrade
        const adminNotification = new Notification({
          user: null,
          title: 'New Upgrade Request',
          message: `New upgrade from ${user.fullname} for ${amount}`,
          type: 'upgrade_created'
        });
        await adminNotification.save();
        req.io.to('admin').emit('newNotification', adminNotification);

        res.status(200).json({ message: 'Upgrade request submitted successfully' });
    } catch (error) {
        console.error('Error in upgradePage_post:', error);
        res.status(500).json({ error: 'Failed to submit upgrade request' });
    }
};

module.exports.copyexpertPage = async (req, res) => {
  try {
   
    // Fetch only admin-created copy trades (owner: null)
    const copyTrades = await CopyTrade.find({ owner: null }).select(
      'traderName traderImage profitShare winRate'
    );

    res.render('copy-expert', {
      copyTrades
    });
  } catch (error) {
    console.error('Error in copyexpertPage:', error);
    res.redirect('/signin');
  }
};



module.exports.copyexpertPage_post = async (req, res) => {
  try {
    const { traderName, amount, duration, user_id } = req.body;

    // Validate input
    if (!traderName || !amount || !duration || !user_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find user
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate amount
    if (amount > user.available) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Find the original admin-created copy trade to get winRate and profitShare
    const originalTrade = await CopyTrade.findOne({ traderName, owner: null });
    if (!originalTrade) {
      return res.status(404).json({ error: 'Trader not found' });
    }

    // Create new copy trade for the user
    const copyTrade = new CopyTrade({
      traderName,
      amount,
      duration,
      startDate: new Date(),
      endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
      winRate: originalTrade.winRate,
      profitShare: originalTrade.profitShare,
      currentProfit: 0,
      status: 'ongoing', // Ensure status is set to 'ongoing'
      owner: user_id // Link to the user
    });

    // Save the copy trade
    await copyTrade.save();

    // Add to user's copyTrades array
    user.copyTrades.push(copyTrade._id);
    user.available -= amount; // Deduct amount from available balance
    await user.save();

    res.status(200).json({ message: 'Copy trade started successfully' });
  } catch (error) {
    console.error('Error in copyexpertPage_post:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports.ongoingsCopyTrades = async (req, res) => {
  try {
    const userId = req.params.id; // Note: Consider using session-based authentication as recommended previously

    // Find user and populate copyTrades
    const user = await User.findById(userId).populate({
      path: 'copyTrades',
      match: { status: 'ongoing' },
      select: 'traderName amount duration startDate endDate currentProfit status winRate' // Include winRate
    });

    if (!user) {
      console.log(`User not found: ${userId}`);
      return res.redirect('/signin');
    }

    console.log('User copyTrades:', user.copyTrades); // Debug log

    // Calculate profit for each ongoing trade
    const copyTrades = user.copyTrades.map(trade => {
      const daysPassed = Math.floor((new Date() - trade.startDate) / (1000 * 60 * 60 * 24));
      const dailyProfitRate = 1.2;
      // Validate winRate; use 0 as fallback if undefined or invalid
      const winRate = typeof trade.winRate === 'number' && !isNaN(trade.winRate) && trade.winRate >= 0 && trade.winRate <= 100 ? trade.winRate : 0;
      const currentProfit = (trade.amount * Math.pow(dailyProfitRate, daysPassed) * (winRate / 100)).toFixed(2);

      // Only update currentProfit if it's a valid number
      if (!isNaN(currentProfit)) {
        trade.currentProfit = Number(currentProfit); // Ensure it's a number
      } else {
        console.warn(`Invalid currentProfit for trade ${trade._id}: ${currentProfit}`);
        trade.currentProfit = trade.currentProfit || 0; // Fallback to current value or 0
      }

      return {
        _id: trade._id,
        traderName: trade.traderName,
        amount: trade.amount,
        duration: trade.duration,
        startDate: trade.startDate,
        endDate: trade.endDate,
        currentProfit: trade.currentProfit,
        status: trade.status,
        winRate: winRate // Include for debugging
      };
    });

    // Save updated trades
    await Promise.all(user.copyTrades.map(trade => trade.save().catch(err => {
      console.error(`Failed to save trade ${trade._id}:`, err);
      return null; // Prevent crash
    })));

    // Debug log for rendered data
    console.log('Rendering copyTrades:', copyTrades);

    // Render the template
    res.render('ongoing-copy-trades', {
      user: {
        _id: user._id,
        fullname: user.fullname,
        isVerified: user.isVerified
      },
      copyTrades
    });
  } catch (error) {
    console.error('Error in ongoingCopyTrades:', error);
    res.redirect('/signin');
  }
};



module.exports.signaltPage = async (req, res) => {
    try {
        const wallet = await Wallet.findOne();
        res.render("signal", { wallet });
    } catch (error) {
        console.error('Error in signaltPage:', error);
        res.status(500).render('error', { message: 'Server error' });
    }
};

module.exports.signaltPage_post = async (req, res) => {
    try {
        const id = req.params.id;
        const { packagename, paymentmethod, amount, narration } = req.body;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Validate amount against user.available
        const availableBalance = parseFloat(user.available);
        const requestedAmount = parseFloat(amount);
        if (isNaN(requestedAmount) || requestedAmount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }
        if (requestedAmount > availableBalance) {
            return res.status(400).json({ error: `Insufficient balance. Available: ${user.currency}${availableBalance}` });
        }

        // Validate inputs
        if (!packagename || !paymentmethod || !narration) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Upload proof of payment to Cloudinary
        let imageUrl = '';
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'signal_proofs'
            });
            imageUrl = result.secure_url;

            // Delete the local file after successful upload
            try {
                await fsPromises.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting local file:', unlinkError);
                // Continue execution even if file deletion fails
            }
        } else {
            return res.status(400).json({ error: 'Proof of payment is required' });
        }

        // Create new signal request
        const signal = new Signal({
            packagename,
            amount: requestedAmount.toString(),
            method: paymentmethod,
            status: 'pending',
            image: imageUrl,
            narration,
            owner: user._id
        });
        await signal.save();

        // Deduct the amount from user's available balance
        const newBalance = (availableBalance - requestedAmount).toFixed(2);
        user.available = newBalance.toString();

        // Link signal to user
        user.signals.push(signal._id);
        await user.save();

        // New: Create signal notification for user
        const signalNotification = new Notification({
          user: user._id,
          title: 'Signal Request Submitted',
          message: `Your signal package request for ${amount} has been submitted.`,
          type: 'signal_created'
        });
        await signalNotification.save();

        // New: Send push notification
        // await sendPushNotification(user._id, signalNotification);

        req.io.to(`notifications_${user._id}`).emit('newNotification', signalNotification);

        // New: Notify admin of new signal
        const adminNotification = new Notification({
          user: null,
          title: 'New Signal Request',
          message: `New signal from ${user.fullname} for ${amount}`,
          type: 'signal_created'
        });
        await adminNotification.save();
        req.io.to('admin').emit('newNotification', adminNotification);

        // Respond with success message for SweetAlert
        res.status(200).json({ message: 'Signal request submitted successfully', type: 'success' });
    } catch (error) {
        console.error('Error in signaltPage_post:', error);
        // Delete the local file if upload fails
        if (req.file && req.file.path) {
            try {
                await fsPromises.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting local file in catch block:', unlinkError);
            }
        }
        res.status(500).json({ error: 'Failed to submit signal request', type: 'error' });
    }
};

// / New: Controller for notifications page (renders modal content or API)
module.exports.notificationsPage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const notifications = await Notification.find({ user: req.params.id }).sort({ createdAt: -1 }).populate('user');
    res.render('notifications', { notifications, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// New: Save push subscription
// module.exports.savePushSubscription = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const subscription = req.body.subscription;

//     // Validate user
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Delete existing subscriptions
//     await PushSubscription.deleteMany({ user: id });

//     // Save new subscription
//     const newSub = new PushSubscription({
//       user: id,
//       endpoint: subscription.endpoint,
//       keys: {
//         p256dh: subscription.keys.p256dh,
//         auth: subscription.keys.auth
//       }
//     });
//     await newSub.save();

//     res.status(201).json({ message: 'Subscription saved successfully' });
//   } catch (error) {
//     console.error('Error saving push subscription:', error);
//     res.status(500).json({ error: 'Failed to save subscription' });
//   }
// };

module.exports.tradingPage = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).populate('livetrades');
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/dashboard');
    }
    res.render('trading-live', { user, livetrades: user.livetrades });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading trading page');
    res.redirect('/dashboard');
  }
};

module.exports.trading_post = async (req, res) => {
  try {
    const id = req.params.id;
    const { trading_type, currency_pair, lot_size, entry_price, stop_loss, take_profit, trading_action } = req.body;
    const user = await User.findById(id);

    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect(`/trading-live/${id}`);
    }

    // Balance check using user.available
    const availableBalance = parseFloat(user.available);
    const lotSize = parseFloat(lot_size);
    const entryPrice = parseFloat(entry_price);

    // Example: Assume 1 lot requires a certain amount (e.g., $1000)
    const requiredBalance = lotSize * 1000; // Adjust this based on your logic
    if (isNaN(availableBalance) || isNaN(lotSize) || isNaN(entryPrice)) {
      req.flash('error', 'Invalid input values');
      return res.redirect(`/trading-live/${id}`);
    }

    if (availableBalance < requiredBalance) {
      req.flash('error', 'Insufficient balance to execute this trade');
      return res.redirect(`/trading-live/${id}`);
    }

    // Create new live trade
    const livetrade = new Livetrading({
      type: trading_type,
      currencypair: currency_pair,
      lotsize: lot_size,
      entryPrice: entry_price,
      stopLoss: stop_loss,
      takeProfit: take_profit,
      action: trading_action,
      owner: user._id,
      status: 'Open',
    });

    await livetrade.save();

    // Update user's livetrades
    user.livetrades.push(livetrade._id);
    await user.save();

    req.flash('success', 'Trade executed successfully');
    res.redirect(`/trading-live/${id}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error executing trade');
    res.redirect(`/trading-live/${req.params.id}`);
  }
};

// Close a live trade
module.exports.closeTrade = async (req, res) => {
  try {
    // Fetch the authenticated user first
    const id = req.params.id
    const user = await User.findById(id);
    if (!user) {
      req.flash('error', 'User not found or not authenticated');
      return res.redirect('/dashboard');
    }

    const tradeId = req.params.id;
    const livetrade = await Livetrading.findById(tradeId);

    if (!livetrade) {
      req.flash('error', 'Trade not found');
      return res.redirect(`/trading-live/${id}`);
    }

    // Check if trade belongs to user
    if (livetrade.owner.toString() !== user._id.toString()) {
      req.flash('error', 'Unauthorized action');
      return res.redirect(`/trading-live/${id}`);
    }

    // Update trade status to closed
    livetrade.status = 'Closed';
    await livetrade.save();

    req.flash('success', 'Trade closed successfully');
    res.redirect(`/trading-live/${id}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error closing trade');
    res.redirect(`/trading-live/${ id || '/dashboard'}`);
  }
};


// Render stock trading page
module.exports.tradingStockPage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('stocktrades').lean();
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/dashboard');
    }
    res.render('trading-stock', { user, stocktrades: user.stocktrades, success: req.flash('success'), error: req.flash('error') });
  } catch (err) {
    console.error('Error in tradingStockPage:', err);
    req.flash('error', 'Error loading stock trading page');
    res.redirect('/dashboard');
  }
};

module.exports.tradingStockPage_post = async (req, res) => {
  try {
    const id = req.params.id;
    console.log('Request body:', req.body); // Debug log

    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const { stock_ticker, amount, trading_action } = req.body;

    if (!stock_ticker || !amount || !trading_action) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const tradeAmount = parseFloat(amount);
    if (isNaN(tradeAmount) || tradeAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const availableBalance = parseFloat(user.available);
    if (trading_action === 'BUY' && availableBalance < tradeAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const newTrade = new stockTrade({
      type: stock_ticker,
      amount: tradeAmount,
      action: trading_action,
      status: 'pending',
      owner: user._id,
    });

    await newTrade.save();
    user.stocktrades.push(newTrade._id);
    if (trading_action === 'BUY') {
      user.available = (availableBalance - tradeAmount).toFixed(2);
    }
    await user.save();

    res.status(200).json({ success: 'Stock trade created successfully' });
  } catch (err) {
    console.error('Error in tradingStockPage_post:', err);
    res.status(500).json({ error: 'Error creating stock trade' });
  }
};

module.exports.closeStockTrade = async (req, res) => {
  try {
    const userId = req.params.id; // Use req.params.id as requested
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const tradeId = req.params.tradeId;
    const trade = await stockTrade.findById(tradeId);
    if (!trade) {
      return res.status(404).json({ error: 'Trade not found' });
    }

    if (trade.owner.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized action' });
    }

    trade.status = 'closed';
    await trade.save();

    res.status(200).json({ success: 'Trade closed successfully' });
  } catch (err) {
    console.error('Error in closeStockTrade:', err);
    res.status(500).json({ error: 'Error closing trade' });
  }
};

module.exports.getStockTrades = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('stocktrades').lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.stocktrades || []);
  } catch (error) {
    console.error('Error in getStockTrades:', error);
    res.status(500).json({ error: 'Failed to fetch stock trades' });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error in getUser:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};

module.exports.cryptoPage = (req, res) => {
  res.render("crypto");
};

module.exports.editProfilePage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) {
      req.flash('error', 'Unauthorized or user not found');
      return res.redirect('/dashboard');
    }
    res.render('edit', { user, messages: req.flash() });
  } catch (err) {
    console.error('Error in editProfilePage:', err);
    req.flash('error', 'Error loading profile page');
    res.redirect('/dashboard');
  }
};

module.exports.editProfilePage_post = async (req, res) => {
  try {
    const userId = req.params.id; // Fetch user ID from req.params.id
    if (req.params.id !== userId) {
      req.flash('error', 'Unauthorized action');
      return res.redirect('/dashboard');
    }

    const user = await User.findById(userId);
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/dashboard');
    }

    if (req.body.updatePI) {
      const {
        fullname,
        username,
        city,
        gender,
        dob,
        marital_status,
        age,
        country,
        state,
        home_address,
      } = req.body;

      if (!fullname?.trim() || !username?.trim() || !city?.trim() || !gender?.trim() || !dob?.trim() || !marital_status?.trim() || !age?.trim() || !country?.trim() || !state?.trim() || !home_address?.trim()) {
        req.flash('error', 'All fields are required');
        return res.redirect(`/edit/${userId}`);
      }

      const existingUser = await User.findOne({ $or: [{ username }, { email: user.email }], _id: { $ne: userId } });
      if (existingUser) {
        req.flash('error', existingUser.username === username ? 'Username already exists' : 'Email already exists');
        return res.redirect(`/edit/${userId}`);
      }

      let imageUrl = user.image;
      if (req.file) {
        try {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'profile_images',
            resource_type: 'image',
          });
          imageUrl = result.secure_url;
          await fs.unlink(req.file.path);
        } catch (err) {
          console.error('Cloudinary upload error:', err);
          await fs.unlink(req.file.path).catch(unlinkErr => console.error('Error deleting local file:', unlinkErr));
          req.flash('error', 'Error uploading profile image');
          return res.redirect(`/edit/${userId}`);
        }
      }

      user.fullname = fullname;
      user.username = username;
      user.city = city;
      user.gender = gender;
      user.dob = dob;
      user.marital_status = marital_status;
      user.age = age;
      user.country = country;
      user.state = state;
      user.address = home_address;
      user.image = imageUrl;

      await user.save();
      req.flash('success', 'Personal information updated successfully');
      res.redirect(`/edit/${userId}`);
    } else if (req.body.changepassword) {
      const { current_password, new_password, verify_password } = req.body;

      if (!current_password?.trim() || !new_password?.trim() || !verify_password?.trim()) {
        req.flash('error', 'All password fields are required');
        return res.redirect(`/edit/${userId}`);
      }

      // Direct string comparison for passwords (no bcrypt)
      if (current_password !== user.password) {
        req.flash('error', 'Current password is incorrect');
        return res.redirect(`/edit/${userId}`);
      }

      if (new_password !== verify_password) {
        req.flash('error', 'New passwords do not match');
        return res.redirect(`/edit/${userId}`);
      }

      if (new_password.length < 6) {
        req.flash('error', 'New password must be at least 6 characters');
        return res.redirect(`/edit/${userId}`);
      }

      user.password = new_password; // Store password as plain text
      await user.save();
      req.flash('success', 'Password updated successfully');
      res.redirect(`/edit/${userId}`);
    } else if (req.body.updatedcontact) {
      const { phone, email, url } = req.body;

      if (!phone?.trim() || !email?.trim()) {
        req.flash('error', 'Phone and email are required');
        return res.redirect(`/edit/${userId}`);
      }

      if (!validator.isEmail(email)) {
        req.flash('error', 'Invalid email format');
        return res.redirect(`/edit/${userId}`);
      }

      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        req.flash('error', 'Email already exists');
        return res.redirect(`/edit/${userId}`);
      }

      user.tel = phone;
      user.email = email;
      user.url = url || '';
      await user.save();
      req.flash('success', 'Contact information updated successfully');
      res.redirect(`/edit/${userId}`);
    } else if (req.body.updateemail) {
      const { emailnotification, smsnotification, email_notifications, escalate_emails } = req.body;

      const emailNotificationsArray = Array.isArray(email_notifications) ? email_notifications : email_notifications ? [email_notifications] : [];
      const escalateEmailsArray = Array.isArray(escalate_emails) ? escalate_emails : escalate_emails ? [escalate_emails] : [];

      user.emailnotification = emailnotification === 'on';
      user.smsnotification = smsnotification === 'on';
      user.email_notifications = emailNotificationsArray;
      user.escalate_emails = escalateEmailsArray;

      await user.save();
      req.flash('success', 'Notification settings updated successfully');
      res.redirect(`/edit/${userId}`);
    } else {
      req.flash('error', 'Invalid form submission');
      res.redirect(`/edit/${userId}`);
    }
  } catch (err) {
    console.error('Error in editProfilePage_post:', err);
    if (req.file && req.file.path) {
      await fs.unlink(req.file.path).catch(unlinkErr => console.error('Error deleting local file:', unlinkErr));
    }
    req.flash('error', 'Error updating profile');
    res.redirect(`/edit/${userId || '/dashboard'}`);
  }
};

module.exports.transactionsPage = (req, res) => {
  res.render("transactions");
};

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
};
