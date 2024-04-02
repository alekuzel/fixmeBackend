const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create a new user
router.post('/', (req, res) => {
    const userData = req.body;
    User.create(userData, (error, result) => {
        if (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({ error: 'Error creating user' });
        }
        res.status(201).json({ message: 'User created successfully', user: result });
    });
});

// Get all users
router.get('/', (req, res) => {
    User.getAll((error, users) => {
        if (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ error: 'Error fetching users' });
        }
        res.status(200).json(users);
    });
});

// Get a user by ID
router.get('/:id', (req, res) => {
    const userId = req.params.id;
    User.getById(userId, (error, user) => {
        if (error) {
            console.error('Error fetching user:', error);
            return res.status(500).json({ error: 'Error fetching user' });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    });
});

// Update a user by ID
router.put('/:id', (req, res) => {
    const userId = req.params.id;
    const userData = req.body;
    User.updateById(userId, userData, (error, result) => {
        if (error) {
            console.error('Error updating user:', error);
            return res.status(500).json({ error: 'Error updating user' });
        }
        res.status(200).json({ message: 'User updated successfully' });
    });
});

// Delete a user by ID
router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    User.deleteById(userId, (error, result) => {
        if (error) {
            console.error('Error deleting user:', error);
            return res.status(500).json({ error: 'Error deleting user' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    });
});

module.exports = router;
