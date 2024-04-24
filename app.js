const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

// Import controllers
const usersController = require('./controllers/usersController');
const adminsController = require('./controllers/adminsController');
const Admin = require('./models/Admin'); // Import your Admin model
const authenticateAdmin = require('./middleware/authMiddleware'); // Import authMiddleware

const app = express();
const port = 3006;

app.use(bodyParser.json());

// Mount controllers to specific routes
app.use('/users', usersController);
app.use('/admins', adminsController);

app.post('/admin/login', async (req, res) => {
    try {
        const admin = await Admin.getByEmailOrUsername(req.body.email, req.body.username);
        if (!admin) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const match = await bcrypt.compare(req.body.password, admin.password);
        if (!match) {
            // Password does not match, register unsuccessful attempt
            await Admin.registerUnsuccessfulLoginAttempt(admin.id, req.ip);
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // If password matches, update last login and authenticate
        const ipAddress = req.ip; // Get client IP address
        await Admin.updateLastLogin(admin.id, ipAddress);
        res.json({ message: 'Authentication successful', admin: admin });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

// Example protected route
app.get('/admin/dashboard', authenticateAdmin, (req, res) => {
    res.json({ message: 'Admin dashboard', admin: req.admin });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});