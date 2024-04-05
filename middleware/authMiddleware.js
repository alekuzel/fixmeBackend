const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

function authenticateAdmin(req, res, next) {
    const { email, username, password } = req.body;
    Admin.findOne({ $or: [{ email }, { username }] }, (err, admin) => {
        if (err || !admin) {
            return res.status(401).json({ message: 'Authentication failed. Admin not found.' });
        }
        bcrypt.compare(password, admin.password, (err, result) => {
            if (err || !result) {
                return res.status(401).json({ message: 'Authentication failed. Invalid password.' });
            }
            // If authentication is successful, attach the admin object to the request for future use
            req.admin = admin;
            next();
        });
    });
}

module.exports = authenticateAdmin;
