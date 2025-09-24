const express = require('express');
const router = express.Router();
const InventoryController = require('../controllers/inventoryController');
const { validateClassification, validateVehicle } = require('../middleware/validation');

const inventoryController = new InventoryController();

// Route to build inventory by classification view
router.get('/classification/:classificationId', inventoryController.buildClassificationView.bind(inventoryController));

// Route to build vehicle detail view
router.get('/detail/:vehicleId', inventoryController.buildVehicleDetailView.bind(inventoryController));

// Route to build inventory management view
router.get('/management', inventoryController.buildManagementView.bind(inventoryController));

// Route to build add classification view
router.get('/add-classification', inventoryController.buildAddClassificationView.bind(inventoryController));

// Route to process add classification
router.post('/add-classification', validateClassification, inventoryController.addClassification.bind(inventoryController));

// Route to build add vehicle view
router.get('/add-vehicle', inventoryController.buildAddVehicleView.bind(inventoryController));

// Route to process add vehicle
router.post('/add-vehicle', validateVehicle, inventoryController.addVehicle.bind(inventoryController));

// Route to build edit vehicle view
router.get('/edit/:vehicleId', inventoryController.buildEditVehicleView.bind(inventoryController));

// Route to process edit vehicle
router.post('/update', inventoryController.updateVehicle.bind(inventoryController));

// Route to process delete vehicle
router.post('/delete', inventoryController.deleteVehicle.bind(inventoryController));

module.exports = router;
