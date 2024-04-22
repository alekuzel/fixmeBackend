const express = require('express');
const User = require('../models/User');
const router = express.Router();


router.post('/', async (req, res) => {
    try {
        const result = await User.create(req.body);
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.getAll({});
        res.send(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.getById(_id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (err) {
        res.status(500).send(err);
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
        res.status(400).send(err);
    }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.deleteById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;