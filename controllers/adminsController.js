const express = require('express');
const Admin = require('../models/Admin'); // Import your Admin model
const authenticateAdmin = require('../middleware/authMiddleware'); // Import the authenticateAdmin middleware
const router = express.Router();
const multer = require('multer');
const { sendConfirmationEmail } = require('../utils/email'); // Import function to send confirmation email


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




// Create a new admin
router.post('/', authenticateAdmin, async (req, res) => {
    
    const adminData = req.body;
    
    // Validate required fields
    if (!adminData.firstName || !adminData.lastName || !adminData.password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = await Admin.create(adminData);
        res.status(201).json({ message: 'Admin created successfully', admin: result });
    } catch (error) {
        console.error('Error creating admin:', error);
        return res.status(500).json({ error: 'Error creating admin' });
    }
});  

// Create a new admin
// Create a new admin with email confirmation
router.post('/register', upload.none(), async (req, res) => {
    const adminData = req.body;
    
    // Validate required fields
    if (!adminData.firstName || !adminData.lastName || !adminData.password || !adminData.email) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Create a new admin record in the database
        const result = await Admin.create(adminData);

        // Send confirmation email
        await sendConfirmationEmail(adminData.email); // Call function to send confirmation email

        res.status(201).json({ message: 'Admin created successfully. Confirmation email sent.', admin: result });
    } catch (error) {
        console.error('Error creating admin:', error);
        return res.status(500).json({ error: error.message });
    }
});

// Get all admins
router.get('/', authenticateAdmin, async (req, res) => {
    try {
        const admins = await Admin.getAll();
        res.status(200).json(admins);
    } catch (error) {
        console.error('Error fetching admins:', error);
        return res.status(500).json({ error: 'Error fetching admins' });
    }
});

// Get admin by ID
router.get('/:id', authenticateAdmin, async (req, res) => {
    try {
        const admin = await Admin.getById(req.params.id);
        res.json(admin);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});


// Update admin
router.put('/:id', authenticateAdmin, async (req, res) => {
    try {
        await Admin.updateById(req.params.id, req.body);
        const updatedAdmin = await Admin.getById(req.params.id);
        res.json(updatedAdmin);
    } catch (err) {
        res.status(500).json({ message: err.message });
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