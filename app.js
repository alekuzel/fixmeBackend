const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3004;

// Middleware
app.use(bodyParser.json());

// MySQL Connection Pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'fixmeapp',
    port: 3004
});

// CRUD endpoints for users table
app.post('/users', (req, res) => {
    // Implement logic to create a new user
});

app.get('/users', (req, res) => {
    pool.query('SELECT * FROM users', (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('An error occurred while fetching users');
        } else {
            res.status(200).json(results);
        }
    });
});

app.get('/users/:id', (req, res) => {
    // Implement logic to fetch a single user by ID
});

app.put('/users/:id', (req, res) => {
    // Implement logic to update a user by ID
});

app.delete('/users/:id', (req, res) => {
    // Implement logic to delete a user by ID
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


// CRUD endpoints for admins table
app.post('/admins', (req, res) => {
    pool.query('SELECT * FROM admins', (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('An error occurred while fetching admins');
        } else {
            res.status(200).json(results);
        }
    });
});

app.get('/admins', (req, res) => {
    // Implement logic to fetch all admins
});

app.get('/admins/:id', (req, res) => {
    // Implement logic to fetch a single admin by ID
});

app.put('/admins/:id', (req, res) => {
    // Implement logic to update a admin by ID
});

app.delete('/admins/:id', (req, res) => {
    // Implement logic to delete a admin by ID
});