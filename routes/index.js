const express = require('express');
const router = express.Router();
const utilities = require('../utilities');
const InventoryController = require('../controllers/inventoryController');

const inventoryController = new InventoryController();

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

// Route for management view (as specified in requirements: site-name/inv/)
router.get('/inv', inventoryController.buildManagementView.bind(inventoryController));

module.exports = router;
