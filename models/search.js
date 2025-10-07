const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'vehicles.db');

class SearchModel {
    constructor() {
        this.db = new sqlite3.Database(dbPath);
    }

    // Search vehicles with filters
    searchVehicles(searchParams) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT i.*, c.classification_name 
                      FROM inventory i 
                      JOIN classifications c ON i.inv_classification_id = c.classification_id 
                      WHERE 1=1`;
            
            const params = [];
            
            // Text search in make, model, year, or description
            if (searchParams.query && searchParams.query.trim()) {
                sql += ` AND (i.inv_make LIKE ? OR i.inv_model LIKE ? OR i.inv_year LIKE ? OR i.inv_description LIKE ?)`;
                const searchTerm = `%${searchParams.query.trim()}%`;
                params.push(searchTerm, searchTerm, searchTerm, searchTerm);
            }
            
            // Filter by classification
            if (searchParams.classification_id && searchParams.classification_id !== 'all') {
                sql += ` AND i.inv_classification_id = ?`;
                params.push(searchParams.classification_id);
            }
            
            // Filter by price range
            if (searchParams.min_price && searchParams.min_price !== '') {
                sql += ` AND i.inv_price >= ?`;
                params.push(parseFloat(searchParams.min_price));
            }
            
            if (searchParams.max_price && searchParams.max_price !== '') {
                sql += ` AND i.inv_price <= ?`;
                params.push(parseFloat(searchParams.max_price));
            }
            
            // Filter by mileage range
            if (searchParams.min_miles && searchParams.min_miles !== '') {
                sql += ` AND i.inv_miles >= ?`;
                params.push(parseInt(searchParams.min_miles));
            }
            
            if (searchParams.max_miles && searchParams.max_miles !== '') {
                sql += ` AND i.inv_miles <= ?`;
                params.push(parseInt(searchParams.max_miles));
            }
            
            // Filter by year range
            if (searchParams.min_year && searchParams.min_year !== '') {
                sql += ` AND i.inv_year >= ?`;
                params.push(parseInt(searchParams.min_year));
            }
            
            if (searchParams.max_year && searchParams.max_year !== '') {
                sql += ` AND i.inv_year <= ?`;
                params.push(parseInt(searchParams.max_year));
            }
            
            // Filter by color
            if (searchParams.color && searchParams.color !== 'all') {
                sql += ` AND i.inv_color = ?`;
                params.push(searchParams.color);
            }
            
            // Add ordering
            sql += ` ORDER BY i.inv_make, i.inv_model`;
            
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Get all unique colors for filter dropdown
    getUniqueColors() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT DISTINCT inv_color FROM inventory WHERE inv_color IS NOT NULL ORDER BY inv_color`;
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map(row => row.inv_color));
                }
            });
        });
    }

    // Get year range for filter dropdowns
    getYearRange() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT MIN(inv_year) as min_year, MAX(inv_year) as max_year FROM inventory`;
            this.db.get(sql, [], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        min_year: row.min_year || new Date().getFullYear() - 10,
                        max_year: row.max_year || new Date().getFullYear()
                    });
                }
            });
        });
    }

    // Get price range for filter dropdowns
    getPriceRange() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT MIN(inv_price) as min_price, MAX(inv_price) as max_price FROM inventory`;
            this.db.get(sql, [], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        min_price: row.min_price || 0,
                        max_price: row.max_price || 100000
                    });
                }
            });
        });
    }

    // Get mileage range for filter dropdowns
    getMileageRange() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT MIN(inv_miles) as min_miles, MAX(inv_miles) as max_miles FROM inventory`;
            this.db.get(sql, [], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        min_miles: row.min_miles || 0,
                        max_miles: row.max_miles || 200000
                    });
                }
            });
        });
    }

    // Save search to history
    saveSearchHistory(searchData) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO search_history (search_query, search_filters, search_results_count, user_ip, user_agent) 
                        VALUES (?, ?, ?, ?, ?)`;
            
            const params = [
                searchData.query || '',
                JSON.stringify(searchData.filters || {}),
                searchData.results_count || 0,
                searchData.user_ip || '',
                searchData.user_agent || ''
            ];
            
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        success: true,
                        search_id: this.lastID
                    });
                }
            });
        });
    }

    // Get recent search history
    getSearchHistory(limit = 10) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM search_history 
                        ORDER BY search_timestamp DESC 
                        LIMIT ?`;
            
            this.db.all(sql, [limit], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Get search statistics
    getSearchStats() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT 
                        COUNT(*) as total_searches,
                        COUNT(DISTINCT search_query) as unique_queries,
                        AVG(search_results_count) as avg_results,
                        MAX(search_timestamp) as last_search
                        FROM search_history`;
            
            this.db.get(sql, [], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // Get popular search terms
    getPopularSearches(limit = 5) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT search_query, COUNT(*) as search_count 
                        FROM search_history 
                        WHERE search_query != '' 
                        GROUP BY search_query 
                        ORDER BY search_count DESC 
                        LIMIT ?`;
            
            this.db.all(sql, [limit], (err, rows) => {
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

module.exports = SearchModel;
