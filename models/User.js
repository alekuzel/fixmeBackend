// Import the database connection pool
const pool = require('../database');

// User model
const User = {
    // Function to create a new user
    create: (userData, callback) => {
        pool.query('INSERT INTO users SET ?', userData, (error, results, fields) => {
            if (error) {
                return callback(error);
            }
            callback(null, results);
        });
    },

    // Function to get all users
    getAll: (callback) => {
        pool.query('SELECT * FROM users', (error, results, fields) => {
            if (error) {
                return callback(error);
            }
            callback(null, results);
        });
    },

    // Function to get a user by ID
    getById: (userId, callback) => {
        pool.query('SELECT * FROM users WHERE id = ?', userId, (error, results, fields) => {
            if (error) {
                return callback(error);
            }
            callback(null, results[0]);
        });
    },

    // Function to update a user by ID
    updateById: (userId, userData, callback) => {
        pool.query('UPDATE users SET ? WHERE id = ?', [userData, userId], (error, results, fields) => {
            if (error) {
                return callback(error);
            }
            callback(null, results);
        });
    },

    // Function to delete a user by ID
    deleteById: (userId, callback) => {
        pool.query('DELETE FROM users WHERE id = ?', userId, (error, results, fields) => {
            if (error) {
                return callback(error);
            }
            callback(null, results);
        });
    }
};

module.exports = User;
