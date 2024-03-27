const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3010;

// Middleware
app.use(bodyParser.json());

// MySQL Connection Pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'fixmeapp',
    port: 3310
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
