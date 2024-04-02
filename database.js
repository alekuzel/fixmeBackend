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
    email VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    password VARCHAR(255) NOT NULL, 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
    FOREIGN KEY (userId) REFERENCES users(id)
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
    image VARCHAR(255),
    password VARCHAR(255) NOT NULL, 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

// Define schema for categories table
const categoriesTableSchema = `
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
)
`;

// Define schema for services table
const servicesTableSchema = `
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    categoryId INT,
    FOREIGN KEY (categoryId) REFERENCES categories(id)
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

pool.query(categoriesTableSchema, (err, results) => {
    if (err) throw err;
    console.log('Categories table created successfully');
});

pool.query(servicesTableSchema, (err, results) => {
    if (err) throw err;
    console.log('Services table created successfully');
});

module.exports = pool; // Export the database connection pool


//CONTINUE WITH UNIQUE EMAILS AND HASHED PASSWORDS -- FROM LATEST CONVERSATION WITH CHATGPT
//THEN AUTHENTICATION FOR ADMINS. DIFFERENT FOR ADMINS AND SUPERADMINS?
//OT THIS WILL BE HANDLED BY FRONTEND? ASK CHATGPT