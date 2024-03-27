const mysql = require('mysql');

// Create a MySQL connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'fixmeapp',
    port: 3310
});

// Define schema for users table
const usersTableSchema = `
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(20),
    age INT,
    image VARCHAR(255), -- Assuming image is stored as a file path
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

// Define schema for login history table
const loginHistoryTableSchema = `
CREATE TABLE IF NOT EXISTS login_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    ipAddress VARCHAR(45) NOT NULL,
    loginTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isSuccess BOOLEAN,
    FOREIGN KEY (userId) REFERENCES users(id) -- Ensure userId references the id column in users table
)
`;


// Define schema for admins table
const adminsTableSchema = `
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(20),
    role ENUM('admin', 'superadmin'),
    image VARCHAR(255), -- assuming image is stored as a file path
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;



// Define schema for procedure types table
const procedureTypesTableSchema = `
CREATE TABLE IF NOT EXISTS procedure_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
)
`;

// Define schema for user procedures table (many-to-many relationship)
const userProceduresTableSchema = `
CREATE TABLE IF NOT EXISTS user_procedures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    procedureId INT,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (procedureId) REFERENCES procedure_types(id)
)
`;

// Execute table creation queries
pool.query(usersTableSchema, (err, results) => {
    if (err) throw err;
    console.log('Users table created successfully');
});

pool.query(adminsTableSchema, (err, results) => {
    if (err) throw err;
    console.log('Admins table created successfully');
});

pool.query(loginHistoryTableSchema, (err, results) => {
    if (err) throw err;
    console.log('Login history table created successfully');
});

pool.query(procedureTypesTableSchema, (err, results) => {
    if (err) throw err;
    console.log('Procedure types table created successfully');
});

pool.query(userProceduresTableSchema, (err, results) => {
    if (err) throw err;
    console.log('User procedures table created successfully');
});

module.exports = pool; // Export the database connection pool
