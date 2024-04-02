const express = require('express');
const Admin = require('../models/Admin'); // Import your Admin model
const router = express.Router();

// Create a new admin
router.post('/', (req, res) => {
    const adminData = req.body;
    Admin.create(adminData, (error, result) => {
        if (error) {
            console.error('Error creating admin:', error);
            return res.status(500).json({ error: 'Error creating admin' });
        }
        res.status(201).json({ message: 'Admin created successfully', admin: result });
    });
});

// Get all admins
router.get('/', (req, res) => {
    Admin.getAll((error, admins) => {
        if (error) {
            console.error('Error fetching admins:', error);
            return res.status(500).json({ error: 'Error fetching admins' });
        }
        res.status(200).json(admins);
    });
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
