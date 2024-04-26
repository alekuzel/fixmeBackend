const express = require('express');
const Admin = require('../models/Admin');
const authenticateAdmin = require('../middleware/authMiddleware');
const router = express.Router();
const multer = require('multer');
const { sendConfirmationEmail } = require('../utils/email');
const { v4: uuidv4 } = require('uuid'); // Import UUID generator
const { pool } = require('../database.js');
const path = require('path');
const fs = require('fs').promises;


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../public/images/admins/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/images/admins/');
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
    })
});

// Upload admin image
router.post('/:id/upload', upload.single('image'), async (req, res) => {
    try {
        const adminId = req.params.id;
        const imagePath = path.relative('public/images', req.file.path);
        const query = 'UPDATE admins SET image = ? WHERE id = ?';

        pool.query(query, [imagePath, adminId], (error, results) => {
            if (error) {
                return res.status(500).json({ message: error.message });
            }
            res.json({ message: 'Image uploaded successfully', results });
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

  

// Create a new admin with email confirmation
router.post('/register', upload.none(), async (req, res) => {
    const adminData = req.body;

    // Validate required fields
    if (!adminData.firstName || !adminData.lastName || !adminData.password || !adminData.email) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Generate UUID for API key
        const apiKey = uuidv4();

        // Generate a confirmation token
        const token = uuidv4();

        // Create a new admin record in the database
        const result = await Admin.create({ ...adminData, apiKey, token });

        // Send confirmation email with the generated confirmation token
        await sendConfirmationEmail(adminData.email, token);

        res.status(201).json({ message: 'Admin created successfully. Confirmation email sent.', admin: result });
    } catch (error) {
        console.error('Error creating admin:', error);
        return res.status(500).json({ error: error.message });
    }
});

// Backend route to fetch support admins
router.get('/support', async (req, res) => {
    try {
        // Fetch admins with role equal to "support"
        const supportAdmins = await Admin.getByRole('support');
        res.status(200).json(supportAdmins);
    } catch (error) {
        console.error('Error fetching support admins:', error);
        return res.status(500).json({ error: 'Error fetching support admins' });
    }
});

// Backend route to fetch support admins
router.get('/admins', async (req, res) => {
    try {
        // Fetch admins with role equal to "support"
        const admins = await Admin.getByRole('admin');
        res.status(200).json(admins);
    } catch (error) {
        console.error('Error fetching admins:', error);
        return res.status(500).json({ error: 'Error fetching admins' });
    }
});

// Confirm registration// Confirm registration
router.post('/confirm-registration', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        const query = 'UPDATE admins SET status = ? WHERE token = ?';
        const result = await pool.query(query, ['active', token]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        // Send a success response
        res.status(200).json({ message: 'Registration confirmed successfully' });
    } catch (error) {
        console.error('Error confirming registration:', error);
        return res.status(500).json({ error: 'Failed to confirm registration' });
    }
});

// Delete admin image
router.delete('/:id/image', async (req, res) => {
    try {
        const admin = await Admin.getById(req.params.id);
        if (admin && admin.image) {
            // Use the correct base directory
            const baseDir = path.resolve('public/images');
            await fs.unlink(path.join(baseDir, admin.image));
            await Admin.update(admin.id, { image: null });
            res.json({ message: 'Image deleted successfully' });
        } else {
            res.status(404).json({ message: 'Admin or image not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update admin image
router.put('/:id/image', upload.single('image'), async (req, res) => {
    try {
        const adminId = req.params.id;
        const imagePath = path.relative('public/images', req.file.path);
        const query = 'UPDATE admins SET image = ? WHERE id = ?';

        pool.query(query, [imagePath, adminId], (error, results) => {
            if (error) {
                return res.status(500).json({ message: error.message });
            }
            res.json({ message: 'Image updated successfully', results });
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Get all admins
router.get('/', async (req, res) => {
    try {
        const admins = await Admin.getAll();
        res.status(200).json(admins);
    } catch (error) {
        console.error('Error fetching admins:', error);
        return res.status(500).json({ error: 'Error fetching admins' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const admin = await Admin.getById(req.params.id);
        // Add the image URL to the admin object
        admin.image = admin.image ? `http://localhost:3006/images/${admin.image}` : null;
        res.json(admin);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

// Get admin by ID
router.get('/:id', async (req, res) => {
    try {
        const admin = await Admin.getById(req.params.id);
        res.json(admin);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});


// Update a user by ID
router.put('/:id', async (req, res) => {
    try {
        const user = await Admin.updateById(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (err) {
        console.log(err); // Add this line
        res.status(400).send(err);
    }
});

router.get('/allLoginAttempts', async (req, res) => {
    try {
        const attempts = await Admin.getAllLoginAttempts();
        res.json(attempts);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

// Delete admin
router.delete('/:id', async (req, res) => {
    try {
        await Admin.deleteById(req.params.id);
        res.json({ message: 'Admin deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.getByEmailOrUsername(req.body.email, req.body.username);
        if (!user) {
            throw new Error();
        }

        const isMatch = await bcrypt.compare(req.body.password, user.passwordHash);
        if (!isMatch) {
            throw new Error();
        }

        const token = User.generateAuthToken(user);
        res.send({ user, token });
    } catch (error) {
        res.status(400).send();
    }
});

module.exports = router;



