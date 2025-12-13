const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');
const multer = require('multer');
const path = require('path');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
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
    } else {
      cb(new Error('Images only (jpeg, jpg, png)!'));
    }
  },
});

// Existing routes...
router.get('/adminRoute', adminController.adminPage);
router.get('/viewUser/:id', adminController.viewUser);
router.get('/editUser/:id', adminController.editUser);
router.put('/editUser/:id', adminController.editUser_post);
router.get('/searchUsers', adminController.searchUsersPage);
router.post('/searchUsers', adminController.searchUsers_post);
router.delete('/deleteUser/:id', adminController.deletePage);
router.post('/suspendUser/:id', adminController.suspendUser);
router.get('/allFunding', adminController.getAllDepositsPage);
router.get('/edit-deposit/:id', adminController.editDepositPage);
router.post('/edit-deposit/:id', adminController.updateDeposit);
router.post('/delete-deposit/:id', adminController.deleteDeposit);
router.get('/allWidthdrawals', adminController.getWithdrawals);
router.get('/withdrawals-edit/:id', adminController.editWithdrawalPage);
router.post('/withdrawals-edit/:id', adminController.editWithdrawal);
router.post('/withdrawals-delete/:id', adminController.deleteWithdrawal);
router.get('/all-affiliates', adminController.allAffiliates);
router.delete('/deleteAffiliate/:id', adminController.deleteAffiliate);
router.get('/all-copytrades', adminController.getAllCopyTradesPage);
router.get('/add-copytrader', adminController.addCopyTradePage);
router.post('/add-copytrader', upload.single('traderImage'), adminController.addCopyTrade_post);
router.get('/edit-copytrade/:id', adminController.editCopyTradePage);
router.post('/edit-copytrader/:id', upload.single('traderImage'), adminController.updateCopyTrade);
router.post('/delete-copytrade/:id', adminController.deleteCopyTrade);
router.get('/user-copytrades', adminController.getAllUserCopyTradesPage);
router.get('/edit-user-copytrade/:id', adminController.editUserCopyTradePage);
router.post('/edit-user-copytrade/:id', adminController.updateUserCopyTrade);
router.post('/delete-user-copytrade/:id', adminController.deleteUserCopyTrade);
router.get('/all-wallets', adminController.getAllWalletsPage);
router.get('/add-wallet', adminController.addWalletPage);
router.post('/add-wallet', upload.fields([
  { name: 'btc_image', maxCount: 1 },
  { name: 'eth_image', maxCount: 1 },
  { name: 'usdt_image', maxCount: 1 },
  { name: 'cashapp_image', maxCount: 1 },
  { name: 'paypal_image', maxCount: 1 },
]), adminController.addWallet_post);
router.get('/edit-wallet/:id', adminController.editWalletPage);
router.post('/edit-wallet/:id', upload.fields([
  { name: 'btc_image', maxCount: 1 },
  { name: 'eth_image', maxCount: 1 },
  { name: 'usdt_image', maxCount: 1 },
  { name: 'cashapp_image', maxCount: 1 },
  { name: 'paypal_image', maxCount: 1 },
]), adminController.updateWallet);
router.post('/delete-wallet/:id', adminController.deleteWallet);
router.get('/allVerify', adminController.getAllVerifications);
router.get('/allVerify/:id', adminController.viewVerification);
router.delete('/verify-delete/:id', adminController.deleteVerification);
router.get('/all-accountUpgrade', adminController.allUpgrades);
router.get('/all-accountUpgrade/:id', adminController.viewUpgrades);
router.delete('/upgrade-delete/:id', adminController.deleteUpgrade);
router.get('/all-signal', adminController.getAllSignals);
router.get('/all-signal/:id', adminController.viewSignal);
router.delete('/delete-signals/:id', adminController.deleteSignal);
router.get('/all-livetrade', adminController.getAllTrades);
router.get('/trades-view/:id', adminController.viewTrade);
router.get('/trades-edit/:id', adminController.editTrade);
router.post('/trades-edit/:id', adminController.updateTrade);
router.post('/trades-delete/:id', adminController.deleteTrade);
router.get('/all-tradestock', adminController.getAllStockTrades);
router.get('/stocktrades/:id', adminController.viewStockTrade);
router.post('/stocktrades-edit/:id', adminController.editStockTrade);
router.post('/stocktrades-delete/:id', adminController.deleteStockTrade);

// New chat routes
router.get('/all-chats', adminController.getAllChats);
router.get('/chat/:id', adminController.viewChat);
router.post('/chat/:id', upload.single('chatImage'), adminController.respondChat);
router.post('/chat-delete/:id', adminController.deleteChat);

// New: Routes for notifications
router.get('/notifications', adminController.notificationsPage);
router.post('/send-custom-notification/:userId', adminController.sendCustomNotification);

module.exports = router;
