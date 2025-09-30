const AccountModel = require('../models/account');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AccountController {
    constructor() {
        this.accountModel = new AccountModel();
        this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    }

    // Deliver login view
    async buildLoginView(req, res, next) {
        try {
            const nav = await require('../utilities').getNav();
            res.render('account/login', {
                title: 'Login',
                nav,
                errors: null,
                message: req.flash('message'),
                account: res.locals.account,
                loggedIn: res.locals.loggedIn
            });
        } catch (error) {
            next(error);
        }
    }

    // Process login
    async processLogin(req, res, next) {
        try {
            const { email, password } = req.body;
            const nav = await require('../utilities').getNav();

            // Validate input
            if (!email || !password) {
                req.flash('message', 'Please provide both email and password.');
                return res.render('account/login', {
                    title: 'Login',
                    nav,
                    errors: null,
                    message: req.flash('message'),
                    account: res.locals.account,
                    loggedIn: res.locals.loggedIn
                });
            }

            // Get account by email
            const account = await this.accountModel.getAccountByEmail(email);
            
            if (!account) {
                req.flash('message', 'Invalid email or password.');
                return res.render('account/login', {
                    title: 'Login',
                    nav,
                    errors: null,
                    message: req.flash('message'),
                    account: res.locals.account,
                    loggedIn: res.locals.loggedIn
                });
            }

            // Check password
            const isPasswordValid = bcrypt.compareSync(password, account.account_password);
            
            if (!isPasswordValid) {
                req.flash('message', 'Invalid email or password.');
                return res.render('account/login', {
                    title: 'Login',
                    nav,
                    errors: null,
                    message: req.flash('message'),
                    account: res.locals.account,
                    loggedIn: res.locals.loggedIn
                });
            }

            // Create JWT token
            const jwtSecret = this.jwtSecret || process.env.JWT_SECRET || 'your-secret-key';
            const token = jwt.sign(
                { 
                    accountId: account.account_id,
                    accountType: account.account_type,
                    accountEmail: account.account_email
                },
                jwtSecret,
                { expiresIn: '1d' }
            );

            // Set cookie
            res.cookie('token', token, { 
                httpOnly: true, 
                secure: false, // Set to true in production with HTTPS
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });
            
            req.flash('message', 'Login successful!');
            res.redirect('/account/management');
        } catch (error) {
            next(error);
        }
    }

    // Deliver registration view
    async buildRegisterView(req, res, next) {
        try {
            const nav = await require('../utilities').getNav();
            res.render('account/register', {
                title: 'Register',
                nav,
                errors: null,
                message: req.flash('message'),
                account: res.locals.account,
                loggedIn: res.locals.loggedIn
            });
        } catch (error) {
            next(error);
        }
    }

    // Process registration
    async processRegister(req, res, next) {
        try {
            const { firstname, lastname, email, password, confirmPassword } = req.body;
            const nav = await require('../utilities').getNav();

            // Validate input
            const errors = [];
            if (!firstname) errors.push('First name is required.');
            if (!lastname) errors.push('Last name is required.');
            if (!email) errors.push('Email is required.');
            if (!password) errors.push('Password is required.');
            if (password !== confirmPassword) errors.push('Passwords do not match.');

            // Password validation
            if (password && password.length < 8) {
                errors.push('Password must be at least 8 characters long.');
            }

            if (errors.length > 0) {
                return res.render('account/register', {
                    title: 'Register',
                    nav,
                    errors,
                    message: null,
                    account: res.locals.account,
                    loggedIn: res.locals.loggedIn
                });
            }

            // Check if email already exists
            const emailExists = await this.accountModel.checkExistingEmail(email);
            if (emailExists) {
                errors.push('Email already exists.');
                return res.render('account/register', {
                    title: 'Register',
                    nav,
                    errors,
                    message: null,
                    account: res.locals.account,
                    loggedIn: res.locals.loggedIn
                });
            }

            // Create account
            await this.accountModel.createAccount({
                firstname,
                lastname,
                email,
                password
            });

            req.flash('message', 'Registration successful! Please login.');
            res.redirect('/account/login');
        } catch (error) {
            next(error);
        }
    }

    // Deliver account management view
    async buildManagementView(req, res, next) {
        try {
            const nav = await require('../utilities').getNav();
            const account = res.locals.account;
            
            res.render('account/management', {
                title: 'Account Management',
                nav,
                account,
                message: req.flash('message')
            });
        } catch (error) {
            next(error);
        }
    }

    // Deliver account update view
    async buildUpdateView(req, res, next) {
        try {
            const nav = await require('../utilities').getNav();
            const account = res.locals.account;
            
            res.render('account/update', {
                title: 'Update Account',
                nav,
                account,
                errors: null,
                message: req.flash('message'),
                loggedIn: res.locals.loggedIn
            });
        } catch (error) {
            next(error);
        }
    }

    // Process account update
    async processAccountUpdate(req, res, next) {
        try {
            const { firstname, lastname, email, account_id } = req.body;
            const nav = await require('../utilities').getNav();
            const account = res.locals.account;

            // Validate input
            const errors = [];
            if (!firstname) errors.push('First name is required.');
            if (!lastname) errors.push('Last name is required.');
            if (!email) errors.push('Email is required.');

            if (errors.length > 0) {
                return res.render('account/update', {
                    title: 'Update Account',
                    nav,
                    account: { ...account, account_firstname: firstname, account_lastname: lastname, account_email: email },
                    errors,
                    message: null,
                    loggedIn: res.locals.loggedIn
                });
            }

            // Check if email already exists (excluding current account)
            const emailExists = await this.accountModel.checkExistingEmail(email, account_id);
            if (emailExists) {
                errors.push('Email already exists.');
                return res.render('account/update', {
                    title: 'Update Account',
                    nav,
                    account: { ...account, account_firstname: firstname, account_lastname: lastname, account_email: email },
                    errors,
                    message: null,
                    loggedIn: res.locals.loggedIn
                });
            }

            // Update account
            await this.accountModel.updateAccount(account_id, {
                firstname,
                lastname,
                email
            });

            // Get updated account data
            const updatedAccount = await this.accountModel.getAccountById(account_id);
            res.locals.account = updatedAccount;

            req.flash('message', 'Account information updated successfully!');
            res.redirect('/account/management');
        } catch (error) {
            next(error);
        }
    }

    // Process password change
    async processPasswordChange(req, res, next) {
        try {
            const { newPassword, confirmPassword, account_id } = req.body;
            const nav = await require('../utilities').getNav();
            const account = res.locals.account;

            // Validate input
            const errors = [];
            if (!newPassword) errors.push('New password is required.');
            if (newPassword !== confirmPassword) errors.push('Passwords do not match.');
            if (newPassword && newPassword.length < 8) {
                errors.push('Password must be at least 8 characters long.');
            }

            if (errors.length > 0) {
                return res.render('account/update', {
                    title: 'Update Account',
                    nav,
                    account,
                    errors,
                    message: null,
                    loggedIn: res.locals.loggedIn
                });
            }

            // Update password
            await this.accountModel.updatePassword(account_id, newPassword);

            req.flash('message', 'Password updated successfully!');
            res.redirect('/account/management');
        } catch (error) {
            next(error);
        }
    }

    // Process logout
    async processLogout(req, res, next) {
        try {
            res.clearCookie('token');
            req.flash('message', 'You have been logged out.');
            res.redirect('/');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AccountController;
