const mysql = require('mysql');
const bcrypt = require('bcrypt');

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
    email VARCHAR(255) NOT NULL UNIQUE,
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
                    adminID INT AUTO_INCREMENT PRIMARY KEY,
                    firstName VARCHAR(255),
                    lastName VARCHAR(255),
                    username VARCHAR(255) UNIQUE,
                    email VARCHAR(255) UNIQUE,
                    twoFactorEnabled BOOLEAN,
                    phoneNumber VARCHAR(20),
                    password VARCHAR(255),
                    role ENUM('superadmin', 'admin', 'support'),
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    lastLogin DATETIME,
                    status ENUM('active', 'inactive', 'suspended'),
                    lastLoginIP VARCHAR(45),
                    MFAEnabled BOOLEAN
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

// Function to hash passwords
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

module.exports = {
    pool,
    hashPassword
};
