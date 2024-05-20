const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const cookieParser = require('cookie-parser'); // Import cookie-parser
const { v4: uuidv4 } = require('uuid');


// Import controllers
const usersController = require('./controllers/usersController');
const adminsController = require('./controllers/adminsController');
const Admin = require('./models/Admin');
const User = require('./models/User');
const authenticateAdmin = require('./middleware/authMiddleware');

function generateSecureToken(admin) {
    const secretKey = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign({
        id: admin.id,
        role: admin.role,
        status: admin.status
    }, secretKey, { expiresIn: '12h' });
    return token;
}

// Enable CORS for all requests


const app = express();
const port = 3006;
app.use(cors());

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

        // Generate a unique session ID
        const sessionId = uuidv4();

        // Store the session ID in your database or session store
        const expiresAt = new Date(Date.now() + 24 * 3600 * 1000); // Set expiration to 24 hours
        await Admin.createSession(admin.id, sessionId, expiresAt);

        // Set a secure, HTTP-only cookie with the session ID
        res.cookie('adminSessionId', sessionId, {
            httpOnly: true,
            secure: false, // Set secure to true if you are using HTTPS
            expires: expiresAt
        });

        res.json({ message: 'Authentication successful', admin: admin });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});


app.get('/verify', (req, res) => {
    // Check if the session cookie exists
    if (req.cookies.adminSessionId) {
        // Implement logic to verify if the adminSessionId is valid
        const sessionId = req.cookies.adminSessionId; // this is a placeholder, you should verify it against your session store
        // Let's assume you have a function to verify session IDs
        Admin.verifySession(sessionId).then(isValid => {
            if (isValid) {
                res.json({ isAuthenticated: true });
            } else {
                res.json({ isAuthenticated: false });
            }
        }).catch(error => {
            console.error('Session verification failed:', error);
            res.status(500).send('An error occurred during session verification');
        });
    } else {
        res.json({ isAuthenticated: false });
    }
});

app.get('/loginAttempts', async (req, res) => {
    try {
        const attempts = await Admin.getAllLoginAttempts();
        res.json(attempts);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

app.get('/loginAttempts/:adminId', async (req, res) => {
    try {
        const attempts = await Admin.getUnsuccessfulLoginAttempts(req.params.adminId);
        res.json(attempts);
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
        res.cookie('userSessionId', 'userAuthToken', { httpOnly: true, secure: false});
        res.json({ message: 'Authentication successful', user: user });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
