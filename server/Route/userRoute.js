const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Multer configuration for chat image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Error: Images only (jpeg, jpg, png)!'));
  },
});

// Existing routes...
router.get('/dashboard', userController.dashboardPage);
router.get('/verify/:id', userController.verifyPage);
router.post('/verify/:id', upload.fields([
  { name: 'idcardFront', maxCount: 1 },
  { name: 'idcardBack', maxCount: 1 },
]), userController.verifyPage_post);
router.get('/deposit', userController.depositPage);
router.post('/deposit/:id', userController.depositPage_post);
router.get('/payment', userController.paymentPage);
router.post('/payment/:id', upload.single('depositProof'), userController.paymentPage_post);
router.get('/withdraw', userController.withdrawPage);
router.post('/withdraw/:id', userController.withdrawPage_post);
router.get('/page/:id', userController.affiliatePage);
router.post('/page/:id', userController.affiliatePage_post);
router.get('/page/:id/affiliates', userController.getAffiliates);
router.get('/page/:id/user', userController.getUser);
router.get('/upgrade', userController.upgradePage);
router.post('/upgrade/:id', upload.single('requestProof'), userController.upgradePage_post);
router.get('/copy-expert', userController.copyexpertPage);
router.post('/copy-expert', userController.copyexpertPage_post);
router.get('/ongoing-copy-trades', userController.ongoingsCopyTrades);
router.get('/ongoing-copy-trades/:id', userController.ongoingsCopyTrades);
router.get('/signal-package', userController.signaltPage);
router.post('/signal-package/:id', upload.single('requestProof'), userController.signaltPage_post);
router.get('/trading-live/:id', userController.tradingPage);
router.post('/trading-live/:id', userController.trading_post);
router.post('/trading-live-close/:id', userController.closeTrade);
router.get('/trading-stock/:id', userController.tradingStockPage);
router.post('/trading-stock/:id', userController.tradingStockPage_post);
router.post('/trading-stock-close/:id/:tradeId', userController.closeStockTrade);
router.get('/trading-stock/:id/trades', userController.getStockTrades);
router.get('/trading-stock/:id/user', userController.getUser);
router.get('/crypto', userController.cryptoPage);
router.get('/edit/:id', userController.editProfilePage);
router.post('/edit/:id', upload.single('changepicture'), userController.editProfilePage_post);
router.get('/transactions/:id', userController.transactionsPage);

// New chat route
router.get('/chat', userController.chatPage);
router.post('/chat/:id', upload.single('chatImage'), userController.chatPage_post);

// New: Route for loading notifications
router.get('/notifications/:id', userController.notificationsPage);

// New: Route for saving push subscription
// router.post('/subscribe-push/:id', userController.savePushSubscription);

module.exports = router;