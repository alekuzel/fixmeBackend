const { pool } = require('../database');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const User = {

    getByEmailOrUsername: (email, username) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username], (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0]);
                }
            });
        });
    },

    findOne: (identifier) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM users WHERE email = ? OR username = ?', [identifier, identifier], (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0]);
                }
            });
        });
    },

    getByUsername: (username) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM users WHERE username = ?', username, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0]);
                }
            });
        });
    },

    create: async (userData) => {

        try {
            const firstNamePrefix = userData.firstName.slice(0, 3).toLowerCase();
            const lastNamePrefix = userData.lastName.slice(0, 3).toLowerCase();
    
            let username = `${firstNamePrefix}${lastNamePrefix}`;
    
            let isUnique = false;
            let suffix = 1;
            while (!isUnique) {
                const existingUser = await User.getByUsername(username);
                if (!existingUser) {
                    isUnique = true;
                } else {
                    suffix++;
                    username = `${firstNamePrefix}${lastNamePrefix}${suffix}`;
                }
            }
    
            userData.Username = username;
          
    
            const hashedPassword = await hashPassword(userData.passwordHash);
            userData.passwordHash = hashedPassword;
    
            return new Promise((resolve, reject) => {
                pool.query('INSERT INTO users SET ?', userData, (error, results, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });
        } catch (error) {
            throw error;
        }

    },

    getAll: () => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM users', (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },

    getById: (id) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM users WHERE id = ?', id, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    if (results.length === 0) {
                        reject(new Error('No user found with this id'));
                    } else {
                        resolve(results[0]);
                    }
                }
            });
        });
    },

    updateById: (id, userData) => {
        return new Promise(async (resolve, reject) => {
            // Check if the new email already exists in the database
            const existingUser = await User.getByEmailOrUsername(userData.email, userData.username);
            if (existingUser && existingUser.id !== id) {
                reject(new Error('Email already in use'));
            } else {
                pool.query('UPDATE users SET ? WHERE id = ?', [userData, id], (error, results, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            }
        });
    },

    deleteById: (id) => {
        return new Promise((resolve, reject) => {
            pool.query('DELETE FROM users WHERE id = ?', id, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },

    updateLastLogin: (id) => {
        // Similar to Admin.updateLastLogin, but interacts with the users table. guess it will go be managed in the activity log table, but leave this empty function here just in case
    },
};

const hashPassword = async (passwordHash) => {
    const saltRounds = 10;
    return await bcrypt.hash(passwordHash, saltRounds);
};

module.exports = User;