const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'vehicles.db');

class InventoryModel {
    constructor() {
        this.db = new sqlite3.Database(dbPath);
    }

    // Get all classifications
    getClassifications() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM classifications ORDER BY classification_name`;
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Get vehicles by classification
    getVehiclesByClassification(classificationId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT i.*, c.classification_name 
                        FROM inventory i 
                        JOIN classifications c ON i.inv_classification_id = c.classification_id 
                        WHERE i.inv_classification_id = ? 
                        ORDER BY i.inv_make, i.inv_model`;
            this.db.all(sql, [classificationId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Get specific vehicle by ID (for detail view)
    getVehicleById(vehicleId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT i.*, c.classification_name 
                        FROM inventory i 
                        JOIN classifications c ON i.inv_classification_id = c.classification_id 
                        WHERE i.inv_id = ?`;
            this.db.get(sql, [vehicleId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // Get all vehicles
    getAllVehicles() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT i.*, c.classification_name 
                        FROM inventory i 
                        JOIN classifications c ON i.inv_classification_id = c.classification_id 
                        ORDER BY i.inv_make, i.inv_model`;
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    close() {
        this.db.close();
    }
}

module.exports = InventoryModel;
