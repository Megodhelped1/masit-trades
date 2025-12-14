// Fixed app.js (added middleware to pass io to req)
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');
const path = require('path');
// const webpush = require('web-push'); // New: web-push library
const { requireAuth, checkUser } = require('./server/authMiddleware/authMiddleware');
// const cloudinary = require('cloudinary').v2;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 4500;

// New: VAPID Keys setup (generate once and add to .env)
// const vapidKeys = {
//   publicKey: process.env.VAPID_PUBLIC_KEY,
//   privateKey: process.env.VAPID_PRIVATE_KEY,
// };
// webpush.setVapidDetails(
//   'mailto:digitaltopfigmairkets@gmail.com', // Replace with your email
//   vapidKeys.publicKey,
//   vapidKeys.privateKey
// );

// Cloudinary configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(methodOverride('_method'));
app.use(
  session({
    secret: 'piuscandothis',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

// Set view engine
app.set('view engine', 'ejs');

// DB config
const db = 'mongodb+srv://marcelpolocha1:081358pius@cluster0.f9a85hv.mongodb.net/masitrade';
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// New: Middleware to pass io to req to avoid circular dependency
app.use((req, res, next) => {
  req.io = req.app.get('io');
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  req.flash('error', err.message || 'Something went wrong!');
  res.redirect('back');
});

// Middleware to pass flash messages to views
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Store io in app for use in controllers
app.set('io', io);

// Socket.IO logic
const Chat = require('./server/Model/Chat');
const User = require('./server/Model/User');
const Notification = require('./server/Model/Notification'); // New import

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('joinChat', async ({ userId }) => {
    socket.join(userId);
    console.log(`User ${userId} joined chat`);

    // Load previous messages
    const chat = await Chat.findOne({ user: userId }).populate('user');
    if (chat) {
      socket.emit('loadMessages', chat.messages);
    }
  });

  socket.on('sendMessage', async ({ userId, content, image }) => {
    try {
      let chat = await Chat.findOne({ user: userId });
      if (!chat) {
        chat = new Chat({ user: userId, messages: [] });
      }

      const message = {
        sender: 'user',
        content,
        image,
        timestamp: new Date(),
      };

      chat.messages.push(message);
      await chat.save();

      // Emit to user
      io.to(userId).emit('newMessage', message);

      // Emit to admin (assuming admin is in a room called 'admin')
      io.to('admin').emit('newMessage', { userId, message });

      // New: Notify admin of new chat message
      const adminNotification = new Notification({
        user: null, // For admin, user is null or use a special admin ID
        title: 'New Chat Message',
        message: `New message from user ${userId}`,
        type: 'chat_message'
      });
      await adminNotification.save();
      io.to('admin').emit('newNotification', adminNotification);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('adminJoin', () => {
    socket.join('admin');
    console.log('Admin joined chat');
  });

  socket.on('adminSendMessage', async ({ userId, content, image }) => {
    try {
      let chat = await Chat.findOne({ user: userId });
      if (!chat) {
        chat = new Chat({ user: userId, messages: [] });
      }

      const message = {
        sender: 'admin',
        content,
        image,
        timestamp: new Date(),
      };

      chat.messages.push(message);
      await chat.save();

      // Emit to user
      io.to(userId).emit('newMessage', message);

      // Emit to admin
      io.to('admin').emit('newMessage', { userId, message });
    } catch (err) {
      console.error(err);
    }
  });

  // New: Join notifications room
  socket.on('joinNotifications', async ({ userId }) => {
    socket.join(`notifications_${userId}`);
    console.log(`User ${userId} joined notifications`);

    // Load unread notifications
    const notifications = await Notification.find({ user: userId, isRead: false }).sort({ createdAt: -1 });
    socket.emit('loadNotifications', notifications);
  });

  // New: Mark notification as read
  socket.on('markRead', async ({ notificationId, userId }) => {
    await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    // Update count for user
    const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });
    io.to(`notifications_${userId}`).emit('updateNotificationCount', unreadCount);
  });

  // New: Receive new notification
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.use(checkUser);
app.use('/', require('./server/Route/indexRoute'));
app.use('/', requireAuth, require('./server/Route/userRoute'));
app.use('/', requireAuth, require('./server/Route/adminRoute'));

server.listen(PORT, () => console.log(`Server running on ${PORT}`));