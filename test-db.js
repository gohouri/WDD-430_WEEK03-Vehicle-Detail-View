const InventoryModel = require('./models/inventory');

async function testDatabase() {
    console.log('Testing database connection...');
    
    try {
        const inventoryModel = new InventoryModel();
        
        // Test getting classifications
        const classifications = await inventoryModel.getClassifications();
        console.log('Classifications:', classifications);
        
        // Test getting vehicles
        const vehicles = await inventoryModel.getAllVehicles();
        console.log('Vehicles:', vehicles);
        
        // Test getting specific vehicle
        const vehicle = await inventoryModel.getVehicleById(1);
        console.log('Vehicle 1:', vehicle);
        
        inventoryModel.close();
        console.log('Database test completed successfully!');
    } catch (error) {
        console.error('Database test failed:', error);
        process.exit(1);
    }
}

testDatabase();
