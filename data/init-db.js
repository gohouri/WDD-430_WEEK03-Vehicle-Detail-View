const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Determine database path based on environment
const dbPath = process.env.NODE_ENV === 'production' 
    ? path.join(__dirname, 'vehicles.db')
    : path.join(__dirname, 'vehicles.db');

// Only create database if it doesn't exist
if (fs.existsSync(dbPath)) {
    console.log('Database already exists, skipping initialization');
    return;
}

console.log('Initializing database at:', dbPath);
const db = new sqlite3.Database(dbPath);

// Create tables
db.serialize(() => {
    // Create classifications table
    db.run(`CREATE TABLE IF NOT EXISTS classifications (
        classification_id INTEGER PRIMARY KEY AUTOINCREMENT,
        classification_name TEXT NOT NULL
    )`);

    // Create accounts table
    db.run(`CREATE TABLE IF NOT EXISTS accounts (
        account_id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_firstname TEXT NOT NULL,
        account_lastname TEXT NOT NULL,
        account_email TEXT UNIQUE NOT NULL,
        account_password TEXT NOT NULL,
        account_type TEXT NOT NULL DEFAULT 'Client'
    )`);

    // Create inventory table
    db.run(`CREATE TABLE IF NOT EXISTS inventory (
        inv_id INTEGER PRIMARY KEY AUTOINCREMENT,
        inv_make TEXT NOT NULL,
        inv_model TEXT NOT NULL,
        inv_year INTEGER NOT NULL,
        inv_description TEXT,
        inv_image TEXT,
        inv_thumbnail TEXT,
        inv_price DECIMAL(10,2) NOT NULL,
        inv_miles INTEGER NOT NULL,
        inv_color TEXT,
        inv_classification_id INTEGER NOT NULL,
        FOREIGN KEY (inv_classification_id) REFERENCES classifications (classification_id)
    )`);

    // Create search_history table
    db.run(`CREATE TABLE IF NOT EXISTS search_history (
        search_id INTEGER PRIMARY KEY AUTOINCREMENT,
        search_query TEXT NOT NULL,
        search_filters TEXT,
        search_results_count INTEGER NOT NULL,
        search_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_ip TEXT,
        user_agent TEXT
    )`);

    // Insert sample classifications
    const classifications = [
        { id: 1, name: 'SUV' },
        { id: 2, name: 'Sedan' },
        { id: 3, name: 'Truck' },
        { id: 4, name: 'Coupe' }
    ];

    const stmt1 = db.prepare(`INSERT OR IGNORE INTO classifications (classification_id, classification_name) VALUES (?, ?)`);
    classifications.forEach(classification => {
        stmt1.run(classification.id, classification.name);
    });
    stmt1.finalize();

    // Insert sample vehicles
    const vehicles = [
        {
            id: 1,
            make: 'Nissan',
            model: 'Sentra',
            year: 2019,
            description: 'Reliable and fuel-efficient sedan perfect for daily commuting.',
            image: '/images/vehicles/nissan-sentra-2019.jpg',
            thumbnail: '/images/vehicles/thumbnails/nissan-sentra-2019.jpg',
            price: 16999.00,
            miles: 74750,
            color: 'Silver',
            classification_id: 2
        },
        {
            id: 2,
            make: 'Honda',
            model: 'CR-V',
            year: 2020,
            description: 'Spacious and versatile SUV with excellent fuel economy.',
            image: '/images/vehicles/honda-crv-2020.jpg',
            thumbnail: '/images/vehicles/thumbnails/honda-crv-2020.jpg',
            price: 24999.00,
            miles: 32500,
            color: 'White',
            classification_id: 1
        },
        {
            id: 3,
            make: 'Ford',
            model: 'F-150',
            year: 2021,
            description: 'Powerful pickup truck with advanced technology and towing capability.',
            image: '/images/vehicles/ford-f150-2021.jpg',
            thumbnail: '/images/vehicles/thumbnails/ford-f150-2021.jpg',
            price: 35999.00,
            miles: 18500,
            color: 'Blue',
            classification_id: 3
        },
        {
            id: 4,
            make: 'Toyota',
            model: 'Camry',
            year: 2022,
            description: 'Comfortable and reliable sedan with modern features.',
            image: '/images/vehicles/toyota-camry-2022.jpg',
            thumbnail: '/images/vehicles/thumbnails/toyota-camry-2022.jpg',
            price: 27999.00,
            miles: 12000,
            color: 'Black',
            classification_id: 2
        },
        {
            id: 5,
            make: 'Chevrolet',
            model: 'Camaro',
            year: 2020,
            description: 'Sporty coupe with powerful performance and sleek design.',
            image: '/images/vehicles/chevrolet-camaro-2020.jpg',
            thumbnail: '/images/vehicles/thumbnails/chevrolet-camaro-2020.jpg',
            price: 32999.00,
            miles: 28000,
            color: 'Red',
            classification_id: 4
        }
    ];

    const stmt2 = db.prepare(`INSERT OR IGNORE INTO inventory 
        (inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, 
         inv_price, inv_miles, inv_color, inv_classification_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    
    vehicles.forEach(vehicle => {
        stmt2.run(
            vehicle.id,
            vehicle.make,
            vehicle.model,
            vehicle.year,
            vehicle.description,
            vehicle.image,
            vehicle.thumbnail,
            vehicle.price,
            vehicle.miles,
            vehicle.color,
            vehicle.classification_id
        );
    });
    stmt2.finalize();

    // Insert sample accounts (passwords are hashed versions of 'password123')
    const bcrypt = require('bcryptjs');
    const accounts = [
        {
            id: 1,
            firstname: 'Basic',
            lastname: 'Client',
            email: 'client@example.com',
            password: bcrypt.hashSync('password123', 10),
            type: 'Client'
        },
        {
            id: 2,
            firstname: 'Happy',
            lastname: 'Employee',
            email: 'employee@example.com',
            password: bcrypt.hashSync('password123', 10),
            type: 'Employee'
        },
        {
            id: 3,
            firstname: 'Admin',
            lastname: 'User',
            email: 'admin@example.com',
            password: bcrypt.hashSync('password123', 10),
            type: 'Admin'
        }
    ];

    const stmt3 = db.prepare(`INSERT OR IGNORE INTO accounts 
        (account_id, account_firstname, account_lastname, account_email, account_password, account_type) 
        VALUES (?, ?, ?, ?, ?, ?)`);
    
    accounts.forEach(account => {
        stmt3.run(
            account.id,
            account.firstname,
            account.lastname,
            account.email,
            account.password,
            account.type
        );
    });
    stmt3.finalize();

    console.log('Database initialized successfully');
});

db.close((err) => {
    if (err) {
        console.error('Error closing database:', err);
        process.exit(1);
    } else {
        console.log('Database connection closed successfully');
    }
});
