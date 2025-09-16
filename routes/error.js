const express = require('express');
const router = express.Router();

// Route to trigger intentional error (Task 3)
router.get('/trigger', (req, res, next) => {
    try {
        // Intentionally throw an error to test error handling
        throw new Error('Intentional error for testing purposes');
    } catch (error) {
        next(error);
    }
});

module.exports = router;
