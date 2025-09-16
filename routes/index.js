const express = require('express');
const router = express.Router();
const utilities = require('../utilities');

// Route to build inventory by classification view
router.get('/', async (req, res, next) => {
    try {
        const nav = await utilities.getNav();
        res.render('index', {
            title: 'Home',
            nav
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
