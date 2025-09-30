const jwt = require('jsonwebtoken');
const AccountModel = require('../models/account');

class AuthMiddleware {
    constructor() {
        this.accountModel = new AccountModel();
        this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    }

    // Middleware to check if user is logged in
    async requireAuth(req, res, next) {
        try {
            const token = req.cookies.token;
            
            if (!token) {
                req.flash('message', 'Please login to access this page.');
                return res.redirect('/account/login');
            }

            const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
            const decoded = jwt.verify(token, jwtSecret);
            
            const AccountModel = require('../models/account');
            const accountModel = new AccountModel();
            const account = await accountModel.getAccountById(decoded.accountId);
            
            if (!account) {
                res.clearCookie('token');
                req.flash('message', 'Invalid session. Please login again.');
                return res.redirect('/account/login');
            }
            res.locals.account = account;
            res.locals.loggedIn = true;
            next();
        } catch (error) {
            res.clearCookie('token');
            req.flash('message', 'Invalid session. Please login again.');
            res.redirect('/account/login');
        }
    }

    // Middleware to check if user is employee or admin
    async requireEmployeeOrAdmin(req, res, next) {
        try {
            const token = req.cookies.token;
            
            if (!token) {
                req.flash('message', 'Please login to access this page.');
                return res.redirect('/account/login');
            }

            const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
            const decoded = jwt.verify(token, jwtSecret);
            
            const AccountModel = require('../models/account');
            const accountModel = new AccountModel();
            const account = await accountModel.getAccountById(decoded.accountId);
            
            if (!account) {
                res.clearCookie('token');
                req.flash('message', 'Invalid session. Please login again.');
                return res.redirect('/account/login');
            }

            if (account.account_type !== 'Employee' && account.account_type !== 'Admin') {
                req.flash('message', 'Access denied. Employee or Admin privileges required.');
                return res.redirect('/account/login');
            }

            res.locals.account = account;
            res.locals.loggedIn = true;
            next();
        } catch (error) {
            res.clearCookie('token');
            req.flash('message', 'Invalid session. Please login again.');
            res.redirect('/account/login');
        }
    }

    // Middleware to check login status (optional)
    async checkLoginStatus(req, res, next) {
        try {
            const token = req.cookies.token;
            
            if (token) {
                try {
                    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
                    const decoded = jwt.verify(token, jwtSecret);
                    
                    const AccountModel = require('../models/account');
                    const accountModel = new AccountModel();
                    const account = await accountModel.getAccountById(decoded.accountId);
                    
                    if (account) {
                        res.locals.account = account;
                        res.locals.loggedIn = true;
                    } else {
                        res.clearCookie('token');
                        res.locals.loggedIn = false;
                    }
                } catch (error) {
                    res.clearCookie('token');
                    res.locals.loggedIn = false;
                }
            } else {
                res.locals.loggedIn = false;
            }
            
            next();
        } catch (error) {
            res.locals.loggedIn = false;
            next();
        }
    }
}

module.exports = new AuthMiddleware();
