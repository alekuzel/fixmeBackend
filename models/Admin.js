const { pool } = require('../database');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('../config.js');
const crypto = require('crypto');
const { sendResetPasswordEmail, sendConfirmationEmail } = require('../utils/email'); // Import the function

const Admin = {

    createSession: (adminId, sessionId, expiresAt) => {
        return new Promise((resolve, reject) => {
            pool.query(
                'INSERT INTO admin_sessions (admin_id, session_id, expires_at) VALUES (?, ?, ?)',
                [adminId, sessionId, expiresAt],
                (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results.insertId); // This returns the ID of the created session if you need it
                    }
                }
            );
        });
    },

    async verifySession (sessionId) {
        const result = await pool.query('SELECT * FROM admin_sessions WHERE session_id = ? AND expires_at > NOW()', [sessionId]);
        return result.length > 0;
    },

    async cleanupSessions () {
        await pool.query('DELETE FROM admin_sessions WHERE expires_at <= NOW()');
    },

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

    async updateStatusByToken(token) {
        try {
            const query = 'UPDATE admins SET status = ? WHERE token = ?';
            const result = await pool.query(query, ['active', token]);

            if (result.affectedRows === 0) {
                return { error: 'Admin not found' };
            }

            return { success: true };
        } catch (error) {
            console.error('Error updating admin status:', error);
            throw new Error('Failed to update admin status');
        }
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
        // Generate unique username
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

        adminData.username = username;

        // Generate API key
        adminData.apiKey = uuid.v4();

        // Generate confirmation token
        const token = crypto.randomBytes(20).toString('hex');
        adminData.token = token;

        // Hash password
        const hashedPassword = await hashPassword(adminData.password);
        adminData.password = hashedPassword;

        // Insert into database
        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO admins SET ?', adminData, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    // Send confirmation email with the token
                    sendConfirmationEmail(adminData.email, token)
                        .then(() => resolve(results))
                        .catch((error) => reject(error));
                }
            });
        });
    } catch (error) {
        throw error;
    }
},

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
                'SELECT * FROM adminloginattempts ORDER BY attemptTime DESC',
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
                'SELECT * FROM adminloginattempts WHERE adminId = ? ORDER BY attemptTime DESC',
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

    async confirmRegistration(token) {
        try {
            const query = 'UPDATE admins SET status = ? WHERE token = ?';
            const result = await pool.query(query, ['active', token]);

            if (result.affectedRows === 0) {
                return { error: 'Admin not found' };
            }

            return { success: true };
        } catch (error) {
            console.error('Error confirming registration:', error);
            throw new Error('Failed to confirm registration');
        }
    },

    async updateImage(adminId, imagePath) {
        try {
            const query = 'UPDATE admins SET image = ? WHERE id = ?';
            const result = await pool.query(query, [imagePath, adminId]);

            return result;
        } catch (error) {
            console.error('Error updating admin image:', error);
            throw new Error('Failed to update admin image');
        }
    },
    
        registerUnsuccessfulLoginAttempt: (adminId, ipAddress) => {
            return new Promise((resolve, reject) => {
                pool.query(
                    'INSERT INTO adminloginattempts (adminId, ipAddress, attemptTime) VALUES (?, ?, NOW())',
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
