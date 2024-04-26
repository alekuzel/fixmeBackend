const { pool } = require('../database');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const Admin = {

    getByEmailOrUsername: (email, username) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM admins WHERE Email = ? OR Username = ?', [email, username], (error, results, fields) => {
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
            pool.query('SELECT * FROM admins WHERE email = ? OR username = ?', [identifier, identifier], (error, results, fields) => {
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
            pool.query('SELECT * FROM admins WHERE Username = ?', username, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0]);
                }
            });
        });
    },


    getByRole: (role) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM admins WHERE role = ?', role, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },
    

// Create a new admin
create: async (adminData) => {
    try {
        const firstNamePrefix = adminData.firstName.slice(0, 3).toLowerCase();
        const lastNamePrefix = adminData.lastName.slice(0, 3).toLowerCase();

        let username = `${firstNamePrefix}${lastNamePrefix}`;

        let isUnique = false;
        let suffix = 1;
        while (!isUnique) {
            const existingAdmin = await Admin.getByUsername(username);
            if (!existingAdmin) {
                isUnique = true;
            } else {
                suffix++;
                username = `${firstNamePrefix}${lastNamePrefix}${suffix}`;
            }
        }

        adminData.Username = username;
        adminData.apiKey = uuid.v4(); // Generate a new apiKey for each admin
        adminData.token= uuid.v4(); // Generate a new confirmation token for each admin

        const hashedPassword = await hashPassword(adminData.password);
        adminData.password = hashedPassword;

        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO admins SET ?', adminData, (error, results, fields) => {
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
    // Get all admins
    getAll: () => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM admins', (error, results, fields) => {
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
            pool.query('SELECT *, UNIX_TIMESTAMP(lastLogin) as lastLogin FROM admins WHERE id = ?', id, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    if (results.length === 0) {
                        reject(new Error('No admin found with this id'));
                    } else {
                        resolve(results[0]);
                    }
                }
            });
        });
    },

// Save admin data
save: function() {
    return new Promise((resolve, reject) => {
        if (this.id) {
            // If id is provided, update the admin
            pool.query('UPDATE admins SET ? WHERE id = ?', [this, this.id], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        } else {
            // If id is not provided, create a new admin
            pool.query('INSERT INTO admins SET ?', this, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        }
    });
},

    


   
    // Update admin by ID
    updateById: (id, adminData) => {
        return new Promise((resolve, reject) => {
            pool.query('UPDATE admins SET ? WHERE id = ?', [adminData, id], (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },

    update: function(id, data) {
        // Implementation of update function...
        return new Promise((resolve, reject) => {
            const query = 'UPDATE admins SET ? WHERE id = ?';
            pool.query(query, [data, id], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },

    getAllLoginAttempts: () => {
        return new Promise((resolve, reject) => {
            pool.query(
                'SELECT * FROM adminLoginAttempts ORDER BY attemptTime DESC',
                (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(results);
                }
            );
        });
    },

    getUnsuccessfulLoginAttempts: (adminId) => {
        return new Promise((resolve, reject) => {
            pool.query(
                'SELECT * FROM adminLoginAttempts WHERE adminId = ? ORDER BY attemptTime DESC',
                [adminId],
                (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(results);
                }
            );
        });
    },

    // Delete admin by ID
    deleteById: (id) => {
        return new Promise((resolve, reject) => {
            pool.query('DELETE FROM admins WHERE id = ?', id, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },

    
        registerUnsuccessfulLoginAttempt: (adminId, ipAddress) => {
            return new Promise((resolve, reject) => {
                pool.query(
                    'INSERT INTO adminLoginAttempts (adminId, ipAddress, attemptTime) VALUES (?, ?, NOW())',
                    [adminId, ipAddress],
                    (error, results) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(results);
                    }
                );
            });
        },
    
   


    // Update last login time
    updateLastLogin: (id) => {
        return new Promise((resolve, reject) => {
            pool.query('UPDATE admins SET lastLogin = CURRENT_TIMESTAMP WHERE id = ?', id, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },

    
};

const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

module.exports = Admin;
