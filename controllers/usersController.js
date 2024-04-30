const express = require('express');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { pool } = require('../database.js');
const fs = require('fs').promises;


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../public/images/users/'); // changed from admins to users
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/images/users/');
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
    })
});

// Upload user image
router.post('/:id/upload', upload.single('image'), async (req, res) => {
    try {
        const userId = req.params.id;
        const imagePath = path.relative('public/images', req.file.path);
        const user = await User.updateById(userId, { image: imagePath }, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (err) {
        res.status(500).send(err);
    }
});

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


// Delete user image
router.delete('/:id/image', async (req, res) => {
    try {
        const user = await User.getById(req.params.id);
        if (user && user.image) {
            // Use the correct base directory
            const baseDir = path.resolve('public/images');
            await fs.unlink(path.join(baseDir, user.image));
            await User. updateById(user.id, { image: null });
            res.json({ message: 'Image deleted successfully' });
        } else {
            res.status(404).json({ message: 'User or image not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update user image
router.put('/:id/image', upload.single('image'), async (req, res) => {
    try {
        const userId = req.params.id;
        const imagePath = path.relative('public/images', req.file.path);
        const query = 'UPDATE users SET image = ? WHERE id = ?';

        pool.query(query, [imagePath, userId], (error, results) => {
            if (error) {
                return res.status(500).json({ message: error.message });
            }
            res.json({ message: 'Image updated successfully', results });
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
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