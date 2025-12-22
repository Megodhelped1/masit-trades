const express = require('express');

const router = express.Router();

const userController = require('../Controllers/userController');
const adminController = require('../Controllers/adminController');

router.get('/', userController.indexPage);

router.get('/about', userController.aboutPage);

router.get('/contact', userController.contactPage);

// router.get('/accountType', userController.accountType);

// router.get('/privacy', userController.privacyPage);

router.get('/faq', userController.privacyPage);

router.get('/register', userController.registerPage);
router.post('/register', userController.registerPage_post);

router.get('/verify-email', userController.verifyEmail);

router.get('/login', userController.loginPage);
router.post('/login', userController.loginPage_post);

router.get('/loginAdmin', userController.loginAdmin);
router.post('/loginAdmin', adminController.loginAdmin_post)

router.get('/logout', userController.logout_get)

module.exports = router;