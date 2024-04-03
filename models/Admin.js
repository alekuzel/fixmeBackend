const { pool } = require('../database');
const bcrypt = require('bcrypt');

const Admin = {
    // Get admin by username
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
    // Other methods...
};

const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

module.exports = Admin;