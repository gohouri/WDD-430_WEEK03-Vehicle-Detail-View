const InventoryModel = require('../models/inventory');

// Navigation data
const nav = [
    { link: '/', text: 'Home' },
    { link: '/inventory/classification/1', text: 'SUVs' },
    { link: '/inventory/classification/2', text: 'Sedans' },
    { link: '/inventory/classification/3', text: 'Trucks' },
    { link: '/inventory/classification/4', text: 'Coupes' }
];

// Get navigation
async function getNav() {
    return nav;
}

// Build classification list for forms
async function buildClassificationList() {
    try {
        const inventoryModel = new InventoryModel();
        const classifications = await inventoryModel.getClassifications();
        inventoryModel.close();
        
        return classifications.map(classification => ({
            value: classification.classification_id,
            name: classification.classification_name
        }));
    } catch (error) {
        console.error('Error building classification list:', error);
        return [];
    }
}

// Custom function to build HTML for vehicle detail
function buildVehicleDetailHTML(vehicle) {
    if (!vehicle) {
        return '<p>Vehicle not found</p>';
    }

    // Format price with currency symbol and commas
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(vehicle.inv_price);

    // Format mileage with commas
    const formattedMiles = new Intl.NumberFormat('en-US').format(vehicle.inv_miles);

    return `
        <div class="vehicle-detail-container">
            <div class="vehicle-image-section">
                <img src="${vehicle.inv_image}" alt="${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}" class="vehicle-main-image">
            </div>
            <div class="vehicle-info-section">
                <h1 class="vehicle-title">${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>
                <div class="price-section">
                    <h2 class="vehicle-price">${formattedPrice}</h2>
                    <p class="price-disclaimer">No-Haggle Price¹</p>
                    <div class="mileage-display">
                        <span class="mileage-label">MILEAGE</span>
                        <span class="mileage-value">${formattedMiles}</span>
                    </div>
                </div>
                <div class="vehicle-specifications">
                    <h3>Vehicle Specifications</h3>
                    <ul class="spec-list">
                        <li><strong>Mileage:</strong> ${formattedMiles}</li>
                        <li><strong>Exterior Color:</strong> ${vehicle.inv_color || 'Unknown'}</li>
                        <li><strong>Interior Color:</strong> Black</li>
                        <li><strong>Fuel Type:</strong> Gasoline</li>
                        <li><strong>Drivetrain:</strong> Front Wheel Drive</li>
                        <li><strong>Transmission:</strong> Automatic</li>
                        <li><strong>Classification:</strong> ${vehicle.classification_name}</li>
                    </ul>
                </div>
                <div class="vehicle-description">
                    <h3>Description</h3>
                    <p>${vehicle.inv_description || 'No description available.'}</p>
                </div>
                <div class="action-buttons">
                    <button class="btn btn-primary">START MY PURCHASE</button>
                    <button class="btn btn-secondary">CONTACT US</button>
                    <button class="btn btn-secondary">SCHEDULE TEST DRIVE</button>
                    <button class="btn btn-secondary">APPLY FOR FINANCING</button>
                </div>
                <div class="contact-info">
                    <p><strong>Call Us:</strong> <span class="phone-number">801-396-7886</span></p>
                    <p><strong>Visit Us:</strong> 123 Main Street, Anytown, ST 12345</p>
                </div>
            </div>
        </div>
    `;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format number with commas
function formatNumber(number) {
    return new Intl.NumberFormat('en-US').format(number);
}

module.exports = {
    getNav,
    buildClassificationList,
    buildVehicleDetailHTML,
    formatCurrency,
    formatNumber
};
