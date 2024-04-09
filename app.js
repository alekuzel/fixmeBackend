const express = require('express');
const bodyParser = require('body-parser');


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

// Example route with admin authentication
app.post('/admin/login', authenticateAdmin, async (req, res) => {
    try {
        await Admin.updateLastLogin(req.admin.id);
        res.json({ message: 'Authentication successful', admin: req.admin });
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
