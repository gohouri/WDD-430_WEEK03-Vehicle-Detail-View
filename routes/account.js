const express = require('express');
const router = express.Router();
const AccountController = require('../controllers/accountController');
const auth = require('../middleware/auth');

const accountController = new AccountController();

// Login routes
router.get('/login', accountController.buildLoginView.bind(accountController));
router.post('/login', accountController.processLogin.bind(accountController));

// Registration routes
router.get('/register', accountController.buildRegisterView.bind(accountController));
router.post('/register', accountController.processRegister.bind(accountController));

// Account management routes (require authentication)
router.get('/management', auth.requireAuth, accountController.buildManagementView.bind(accountController));

// Account update routes (require authentication)
router.get('/update', auth.requireAuth, accountController.buildUpdateView.bind(accountController));
router.post('/update', auth.requireAuth, accountController.processAccountUpdate.bind(accountController));
router.post('/change-password', auth.requireAuth, accountController.processPasswordChange.bind(accountController));

// Logout route
router.get('/logout', accountController.processLogout.bind(accountController));

module.exports = router;
