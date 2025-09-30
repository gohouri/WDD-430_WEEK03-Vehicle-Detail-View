const express = require('express');
const router = express.Router();
const InventoryController = require('../controllers/inventoryController');
const { validateClassification, validateVehicle } = require('../middleware/validation');
const auth = require('../middleware/auth');

const inventoryController = new InventoryController();

// Route to build inventory by classification view
router.get('/classification/:classificationId', inventoryController.buildClassificationView.bind(inventoryController));

// Route to build vehicle detail view
router.get('/detail/:vehicleId', inventoryController.buildVehicleDetailView.bind(inventoryController));

// Route to build inventory management view (requires Employee or Admin)
router.get('/management', auth.requireEmployeeOrAdmin, inventoryController.buildManagementView.bind(inventoryController));

// Route to build add classification view (requires Employee or Admin)
router.get('/add-classification', auth.requireEmployeeOrAdmin, inventoryController.buildAddClassificationView.bind(inventoryController));

// Route to process add classification (requires Employee or Admin)
router.post('/add-classification', auth.requireEmployeeOrAdmin, validateClassification, inventoryController.addClassification.bind(inventoryController));

// Route to build add vehicle view (requires Employee or Admin)
router.get('/add-vehicle', auth.requireEmployeeOrAdmin, inventoryController.buildAddVehicleView.bind(inventoryController));

// Route to process add vehicle (requires Employee or Admin)
router.post('/add-vehicle', auth.requireEmployeeOrAdmin, validateVehicle, inventoryController.addVehicle.bind(inventoryController));

// Route to build edit vehicle view (requires Employee or Admin)
router.get('/edit/:vehicleId', auth.requireEmployeeOrAdmin, inventoryController.buildEditVehicleView.bind(inventoryController));

// Route to process edit vehicle (requires Employee or Admin)
router.post('/update', auth.requireEmployeeOrAdmin, inventoryController.updateVehicle.bind(inventoryController));

// Route to process delete vehicle (requires Employee or Admin)
router.post('/delete', auth.requireEmployeeOrAdmin, inventoryController.deleteVehicle.bind(inventoryController));

module.exports = router;
