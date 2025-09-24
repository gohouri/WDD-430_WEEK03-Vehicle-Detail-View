// Validation middleware for forms

// Classification validation
function validateClassification(req, res, next) {
    const { classification_name } = req.body;
    const errors = [];

    // Check if classification_name exists
    if (!classification_name || classification_name.trim() === '') {
        errors.push('Classification name is required.');
    } else {
        const trimmedName = classification_name.trim();
        
        // Check for spaces or special characters
        const pattern = /^[a-zA-Z0-9]+$/;
        if (!pattern.test(trimmedName)) {
            errors.push('Classification name cannot contain spaces or special characters. Only letters and numbers are allowed.');
        }
        
        // Check length
        if (trimmedName.length > 30) {
            errors.push('Classification name cannot exceed 30 characters.');
        }
        
        // Check minimum length
        if (trimmedName.length < 2) {
            errors.push('Classification name must be at least 2 characters long.');
        }
    }

    if (errors.length > 0) {
        return res.render('./inventory/add-classification', {
            title: 'Add New Classification',
            nav: req.nav || [],
            errors,
            classification_name: req.body.classification_name || '',
            message: 'Please correct the errors below.',
            messageType: 'error'
        });
    }

    // Sanitize the input
    req.body.classification_name = req.body.classification_name.trim();
    next();
}

// Vehicle validation
function validateVehicle(req, res, next) {
    const { 
        inv_make, inv_model, inv_year, inv_price, inv_miles, 
        inv_color, inv_description, inv_classification_id, 
        inv_image, inv_thumbnail 
    } = req.body;
    
    const errors = [];

    // Required fields validation
    if (!inv_make || inv_make.trim() === '') {
        errors.push('Vehicle make is required.');
    }
    
    if (!inv_model || inv_model.trim() === '') {
        errors.push('Vehicle model is required.');
    }
    
    if (!inv_year || isNaN(inv_year)) {
        errors.push('Valid vehicle year is required.');
    } else {
        const year = parseInt(inv_year);
        const currentYear = new Date().getFullYear();
        if (year < 1900 || year > currentYear + 1) {
            errors.push('Vehicle year must be between 1900 and ' + (currentYear + 1) + '.');
        }
    }
    
    if (!inv_price || isNaN(inv_price)) {
        errors.push('Valid price is required.');
    } else {
        const price = parseFloat(inv_price);
        if (price <= 0) {
            errors.push('Price must be greater than 0.');
        }
        if (price > 1000000) {
            errors.push('Price cannot exceed $1,000,000.');
        }
    }
    
    if (!inv_miles || isNaN(inv_miles)) {
        errors.push('Valid mileage is required.');
    } else {
        const miles = parseInt(inv_miles);
        if (miles < 0) {
            errors.push('Mileage cannot be negative.');
        }
        if (miles > 999999) {
            errors.push('Mileage cannot exceed 999,999 miles.');
        }
    }
    
    if (!inv_classification_id || inv_classification_id === '') {
        errors.push('Classification is required.');
    }
    
    if (!inv_color || inv_color.trim() === '') {
        errors.push('Color is required.');
    }
    
    if (!inv_description || inv_description.trim() === '') {
        errors.push('Description is required.');
    }
    
    if (!inv_image || inv_image.trim() === '') {
        errors.push('Image path is required.');
    }
    
    if (!inv_thumbnail || inv_thumbnail.trim() === '') {
        errors.push('Thumbnail path is required.');
    }

    // Field length validation
    if (inv_color && inv_color.trim().length > 50) {
        errors.push('Color cannot exceed 50 characters.');
    }
    
    if (inv_description && inv_description.trim().length > 500) {
        errors.push('Description cannot exceed 500 characters.');
    }
    
    if (inv_image && inv_image.trim().length > 255) {
        errors.push('Image path cannot exceed 255 characters.');
    }
    
    if (inv_thumbnail && inv_thumbnail.trim().length > 255) {
        errors.push('Thumbnail path cannot exceed 255 characters.');
    }

    if (errors.length > 0) {
        // Get navigation and classification list for sticky form
        const utilities = require('../utilities');
        Promise.all([
            utilities.getNav(),
            utilities.buildClassificationList()
        ]).then(([nav, classificationSelect]) => {
            res.render('./inventory/add-vehicle', {
                title: 'Add New Vehicle',
                nav,
                classificationSelect,
                errors,
                message: 'Please correct the errors below.',
                messageType: 'error',
                // Sticky form data
                inv_make: req.body.inv_make || '',
                inv_model: req.body.inv_model || '',
                inv_year: req.body.inv_year || '',
                inv_price: req.body.inv_price || '',
                inv_miles: req.body.inv_miles || '',
                inv_color: req.body.inv_color || '',
                inv_description: req.body.inv_description || '',
                inv_classification_id: req.body.inv_classification_id || '',
                inv_image: req.body.inv_image || '/images/vehicles/no-image.jpg',
                inv_thumbnail: req.body.inv_thumbnail || '/images/vehicles/thumbnails/no-image.jpg'
            });
        }).catch(error => {
            next(error);
        });
        return;
    }

    // Sanitize inputs
    req.body.inv_make = req.body.inv_make.trim();
    req.body.inv_model = req.body.inv_model.trim();
    req.body.inv_year = parseInt(req.body.inv_year);
    req.body.inv_price = parseFloat(req.body.inv_price);
    req.body.inv_miles = parseInt(req.body.inv_miles);
    req.body.inv_color = req.body.inv_color ? req.body.inv_color.trim() : '';
    req.body.inv_description = req.body.inv_description ? req.body.inv_description.trim() : '';
    req.body.inv_classification_id = parseInt(req.body.inv_classification_id);
    
    next();
}

module.exports = {
    validateClassification,
    validateVehicle
};
