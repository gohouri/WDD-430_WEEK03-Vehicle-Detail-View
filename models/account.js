const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

class AccountModel {
    constructor() {
        this.dbPath = path.join(__dirname, '..', 'data', 'vehicles.db');
    }

    // Get account by email
    async getAccountByEmail(email) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbPath);
            const sql = `SELECT account_id, account_firstname, account_lastname, 
                        account_email, account_password, account_type 
                        FROM accounts WHERE account_email = ?`;
            
            db.get(sql, [email], (err, row) => {
                db.close();
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // Get account by ID
    async getAccountById(accountId) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbPath);
            const sql = `SELECT account_id, account_firstname, account_lastname, 
                        account_email, account_password, account_type 
                        FROM accounts WHERE account_id = ?`;
            
            db.get(sql, [accountId], (err, row) => {
                db.close();
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // Create new account
    async createAccount(accountData) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbPath);
            const { firstname, lastname, email, password, type = 'Client' } = accountData;
            const hashedPassword = bcrypt.hashSync(password, 10);
            
            const sql = `INSERT INTO accounts (account_firstname, account_lastname, 
                        account_email, account_password, account_type) 
                        VALUES (?, ?, ?, ?, ?)`;
            
            db.run(sql, [firstname, lastname, email, hashedPassword, type], function(err) {
                db.close();
                if (err) {
                    reject(err);
                } else {
                    resolve({ accountId: this.lastID, ...accountData });
                }
            });
        });
    }

    // Update account information
    async updateAccount(accountId, accountData) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbPath);
            const { firstname, lastname, email } = accountData;
            
            const sql = `UPDATE accounts SET account_firstname = ?, account_lastname = ?, 
                        account_email = ? WHERE account_id = ?`;
            
            db.run(sql, [firstname, lastname, email, accountId], function(err) {
                db.close();
                if (err) {
                    reject(err);
                } else {
                    resolve({ changes: this.changes });
                }
            });
        });
    }

    // Update account password
    async updatePassword(accountId, newPassword) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbPath);
            const hashedPassword = bcrypt.hashSync(newPassword, 10);
            
            const sql = `UPDATE accounts SET account_password = ? WHERE account_id = ?`;
            
            db.run(sql, [hashedPassword, accountId], function(err) {
                db.close();
                if (err) {
                    reject(err);
                } else {
                    resolve({ changes: this.changes });
                }
            });
        });
    }

    // Check if email already exists (for validation)
    async checkExistingEmail(email, excludeAccountId = null) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbPath);
            let sql = `SELECT account_id FROM accounts WHERE account_email = ?`;
            let params = [email];
            
            if (excludeAccountId) {
                sql += ` AND account_id != ?`;
                params.push(excludeAccountId);
            }
            
            db.get(sql, params, (err, row) => {
                db.close();
                if (err) {
                    reject(err);
                } else {
                    resolve(!!row);
                }
            });
        });
    }
}

module.exports = AccountModel;
