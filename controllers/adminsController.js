const express = require('express');
const Admin = require('../models/Admin'); // Import your Admin model
const router = express.Router();

// Create a new admin
router.post('/', async (req, res) => {
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
router.get('/:id', (req, res) => {
    const adminId = req.params.id;
    Admin.getById(adminId, (error, admin) => {
        if (error) {
            console.error('Error fetching admin:', error);
            return res.status(500).json({ error: 'Error fetching admin' });
        }
        if (!admin) {
            return res.status(404).json({ error: 'Admin with given id is not found' });
        }
        res.status(200).json(admin);
    });
});

// Update admin by ID
router.put('/:id', (req, res) => {
    const adminId = req.params.id;
    const adminData = req.body;
    Admin.updateById(adminId, adminData, (error, result) => {
        if (error) {
            console.error('Error updating admin:', error);
            return res.status(500).json({ error: 'Error updating admin' });
        }
        res.status(200).json({ message: 'Admin updated successfully' });
    });
});

// Delete a admin by ID
router.delete('/:id', (req, res) => {
    const adminId = req.params.id;
    Admin.deleteById(adminId, (error, result) => {
        if (error) {
            console.error('Error deleting admin:', error);
            return res.status(500).json({ error: 'Error deleting admin' });
        }
        res.status(200).json({ message: 'Admin deleted successfully' });
    });
});

module.exports = router;
