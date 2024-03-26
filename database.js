// database.js

const mysql = require('mysql');

// Create a MySQL connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'fixme',
    port: 3310
  });

// Define schema for users table
const usersTableSchema = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(20),
    address VARCHAR(255),
    gender ENUM('male', 'female', 'other'),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

const userAddressesTableSchema = `
  CREATE TABLE IF NOT EXISTS user_addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    town VARCHAR(255),
    zip VARCHAR(10),
    street VARCHAR(255),
    houseNumber VARCHAR(20),
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
    FOREIGN KEY (userId) REFERENCES users(id)
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

pool.query(userAddressesTableSchema, (err, results) => {
    if (err) throw err;
    console.log('User addresses table created successfully');
  });

pool.query(loginHistoryTableSchema, (err, results) => {
  if (err) throw err;
  console.log('Login history table created successfully');
});

module.exports = pool; // Export the database connection pool
