const pool = require('../database'); // Assuming you have a database connection pool set up

const Admin = {
    // Create a new admin
    create: (adminData, callback) => {
        pool.query('INSERT INTO admins SET ?', adminData, (error, results, fields) => {
            if (error) {
                // Handle error
                return callback(error);
            }
            // If successful, return the inserted row
            callback(null, results);
        });
    },
    
    // Get all admins
    getAll: (callback) => {
        pool.query('SELECT * FROM admins', (error, results, fields) => {
            if (error) {
                // Handle error
                return callback(error);
            }
            // If successful, return all admin records
            callback(null, results);
        });
    },
    
    // Get admin by ID
    getById: (adminId, callback) => {
        pool.query('SELECT * FROM admins WHERE id = ?', adminId, (error, results, fields) => {
            if (error) {
                // Handle error
                return callback(error);
            }
            // If successful, return the first matching admin record
            callback(null, results[0]);
        });
    },
    
    // Update admin by ID
    updateById: (adminId, adminData, callback) => {
        pool.query('UPDATE admins SET ? WHERE id = ?', [adminData, adminId], (error, results, fields) => {
            if (error) {
                // Handle error
                return callback(error);
            }
            // If successful, return the updated row
            callback(null, results);
        });
    },
    
    // Delete admin by ID
    deleteById: (adminId, callback) => {
        pool.query('DELETE FROM admins WHERE id = ?', adminId, (error, results, fields) => {
            if (error) {
                // Handle error
                return callback(error);
            }
            // If successful, return the deleted row
            callback(null, results);
        });
    },

    // Find admins based on certain criteria
    find: (criteria, callback) => {
        // Example query: SELECT * FROM admins WHERE criteria
        pool.query('SELECT * FROM admins WHERE ?', criteria, (error, results, fields) => {
            if (error) {
                // Handle error
                return callback(error);
            }
            // If successful, return all matching admin records
            callback(null, results);
        });
    }
};

module.exports = Admin;
