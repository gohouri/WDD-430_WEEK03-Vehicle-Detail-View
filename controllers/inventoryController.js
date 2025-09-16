const InventoryModel = require('../models/inventory');
const utilities = require('../utilities');

class InventoryController {
    constructor() {
        this.inventoryModel = new InventoryModel();
    }

    // Build classification view
    async buildClassificationView(req, res, next) {
        try {
            const classificationId = req.params.classificationId;
            const classificationName = req.params.classificationName;
            const vehicles = await this.inventoryModel.getVehiclesByClassification(classificationId);
            
            const nav = await utilities.getNav();
            const className = classificationName;
            
            res.render('./inventory/classification', {
                title: className,
                nav,
                vehicles,
                className
            });
        } catch (error) {
            next(error);
        }
    }

    // Build vehicle detail view
    async buildVehicleDetailView(req, res, next) {
        try {
            const vehicleId = req.params.vehicleId;
            const vehicle = await this.inventoryModel.getVehicleById(vehicleId);
            
            if (!vehicle) {
                const error = new Error('Vehicle not found');
                error.status = 404;
                throw error;
            }

            const nav = await utilities.getNav();
            const vehicleName = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`;
            
            res.render('./inventory/detail', {
                title: vehicleName,
                nav,
                vehicle
            });
        } catch (error) {
            next(error);
        }
    }

    // Build inventory management view
    async buildManagementView(req, res, next) {
        try {
            const nav = await utilities.getNav();
            const classificationSelect = await utilities.buildClassificationList();
            
            res.render('./inventory/management', {
                title: 'Vehicle Management',
                nav,
                classificationSelect
            });
        } catch (error) {
            next(error);
        }
    }

    // Build add vehicle view
    async buildAddVehicleView(req, res, next) {
        try {
            const nav = await utilities.getNav();
            const classificationSelect = await utilities.buildClassificationList();
            
            res.render('./inventory/add-vehicle', {
                title: 'Add Vehicle',
                nav,
                classificationSelect
            });
        } catch (error) {
            next(error);
        }
    }

    // Process add vehicle
    async addVehicle(req, res, next) {
        try {
            const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body;
            
            // Add vehicle logic would go here
            // For now, just redirect to management
            req.flash('notice', 'Vehicle added successfully');
            res.redirect('/inventory/management');
        } catch (error) {
            next(error);
        }
    }

    // Build edit vehicle view
    async buildEditVehicleView(req, res, next) {
        try {
            const vehicleId = req.params.vehicleId;
            const vehicle = await this.inventoryModel.getVehicleById(vehicleId);
            const nav = await utilities.getNav();
            const classificationSelect = await utilities.buildClassificationList();
            
            res.render('./inventory/edit-vehicle', {
                title: `Edit ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
                nav,
                classificationSelect,
                vehicle
            });
        } catch (error) {
            next(error);
        }
    }

    // Process edit vehicle
    async updateVehicle(req, res, next) {
        try {
            const vehicleId = req.params.vehicleId;
            // Update vehicle logic would go here
            req.flash('notice', 'Vehicle updated successfully');
            res.redirect('/inventory/management');
        } catch (error) {
            next(error);
        }
    }

    // Process delete vehicle
    async deleteVehicle(req, res, next) {
        try {
            const vehicleId = req.params.vehicleId;
            // Delete vehicle logic would go here
            req.flash('notice', 'Vehicle deleted successfully');
            res.redirect('/inventory/management');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = InventoryController;
