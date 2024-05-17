const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const cookieParser = require('cookie-parser'); // Import cookie-parser

// Import controllers
const usersController = require('./controllers/usersController');
const adminsController = require('./controllers/adminsController');
const Admin = require('./models/Admin');
const User = require('./models/User');
const authenticateAdmin = require('./middleware/authMiddleware');

const app = express();
const port = 3006;

app.use(bodyParser.json());
app.use(cookieParser()); // Use cookie-parser middleware

// Mount controllers to specific routes
app.use('/users', usersController);
app.use('/admins', adminsController);

app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Admin login endpoint
app.post('/admin/login', async (req, res) => {
    try {
        const admin = await Admin.getByEmailOrUsername(req.body.email, req.body.username);
        if (!admin) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const match = await bcrypt.compare(req.body.password, admin.password);
        if (!match) {
            await Admin.registerUnsuccessfulLoginAttempt(admin.id, req.ip);
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        await Admin.updateLastLogin(admin.id, req.ip);
        // Set a cookie upon successful authentication
        res.cookie('adminSessionId', 'adminAuthToken', { httpOnly: true, secure: true });
        res.json({ message: 'Authentication successful', admin: admin });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

// User login endpoint
app.post('/users/login', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = await User.getByEmailOrUsername(email, username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        await User.updateLastLogin(user.id, req.ip);
        // Set a cookie upon successful authentication
        res.cookie('userSessionId', 'userAuthToken', { httpOnly: true, secure: true });
        res.json({ message: 'Authentication successful', user: user });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
