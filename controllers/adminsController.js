const express = require('express');
const Admin = require('../models/Admin');
const authenticateAdmin = require('../middleware/authMiddleware');
const router = express.Router();
const multer = require('multer');
const { sendConfirmationEmail } = require('../utils/email');
const { v4: uuidv4 } = require('uuid'); // Import UUID generator

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/admins/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Upload admin image
router.post('/:id/upload', upload.single('image'), async (req, res) => {
    try {
        const admin = await Admin.getById(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        admin.image = req.file.path;
        await admin.save();
        res.json({ message: 'Image uploaded successfully', admin });
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

// Confirm registration
router.post('/confirm-registration', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        // Check if an admin with the provided API key exists in the database
        const admin = await Admin.findOne({ token: token });

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        // Update the status to 'active' to indicate confirmed registration
        admin.status = 'active';

        // Save the updated admin record
        await admin.save();

        // Send a success response
        res.status(200).json({ message: 'Registration confirmed successfully' });
    } catch (error) {
        console.error('Error confirming registration:', error);
        return res.status(500).json({ error: 'Failed to confirm registration' });
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
        const user = await User.updateById(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (err) {
        console.log(err); // Add this line
        res.status(400).send(err);
    }
});

// Delete admin
router.delete('/:id', authenticateAdmin, async (req, res) => {
    try {
        await Admin.deleteById(req.params.id);
        res.json({ message: 'Admin deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;




//LAST LOGIN TIME, --> ASK CHATGPT
//TOKEN AND/OR PASSPORT.JS
//CREATE SIMPLE FRONTEND TO TEST HOW IT WOTKS NOW
//THEN PROCEED WITH FUNCTIONALITIES FOR DIFFERENT TYPES OF ADMINS