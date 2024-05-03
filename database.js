const mysql = require('mysql');
const bcrypt = require('bcrypt');
const config = require('./config');


const pool = mysql.createPool(config.database);

const adminLoginAttemptsTableSchema = `
CREATE TABLE IF NOT EXISTS adminLoginAttempts (
    attemptID INT AUTO_INCREMENT PRIMARY KEY,
    adminID INT NOT NULL,
    attemptTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ipAddress VARCHAR(45) NOT NULL,
    FOREIGN KEY (adminID) REFERENCES admins(id)
)
`;
// Users Table Schema
const usersTableSchema = `
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(20),
    image VARCHAR(255),
    status ENUM('active', 'inactive', 'suspended'),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    language VARCHAR(255),
    timeZone VARCHAR(255)
)
`;

const providersTableSchema = `
CREATE TABLE IF NOT EXISTS providers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(20),
    image VARCHAR(255),
    status ENUM('active', 'inactive', 'suspended'),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    language VARCHAR(255),
    timeZone VARCHAR(255)
)
`;

const servicesTableSchema = `
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    providerID INT,
    categoryID INT,
    serviceName VARCHAR(255) NOT NULL,
    description TEXT,
    priceID INT,
    isActive BOOLEAN NOT NULL DEFAULT 1,
    FOREIGN KEY (providerID) REFERENCES providers(id),
    FOREIGN KEY (categoryID) REFERENCES categories(id),
    FOREIGN KEY (priceID) REFERENCES prices(id)
)
`;

const createDurationTable = `
CREATE TABLE IF NOT EXISTS duration (
    id INT AUTO_INCREMENT PRIMARY KEY,
    duration INT NOT NULL
)
`;


const createHairTypeTable = `
CREATE TABLE IF NOT EXISTS hairtypes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    UNIQUE(name)
)
`;


const createServiceDurationTable = `
CREATE TABLE IF NOT EXISTS serviceDuration(
    serviceID INT,
    durationID INT,
    hairtypeID INT,
    providerID INT,
    customDuration INT,
    FOREIGN KEY (serviceID) REFERENCES services(id),
    FOREIGN KEY (durationID) REFERENCES duration(id),
    FOREIGN KEY (hairTypeID) REFERENCES hairtypes(id),
    FOREIGN KEY (providerID) REFERENCES providers(id),
    PRIMARY KEY (serviceID, durationID, hairtypeID,  providerID)
);\
`;



// Define schema for categories table

const categoriesTableSchema = `
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    Description TEXT,
    Image VARCHAR(255),
    IsActive BOOLEAN NOT NULL DEFAULT 1,
    CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
)
`;


// User Activity Log Table Schema
const userActivityLogTableSchema = `
CREATE TABLE IF NOT EXISTS userActivityLog (
    activityLogID INT AUTO_INCREMENT PRIMARY KEY,
    id INT NOT NULL,
    ipAddress VARCHAR(45) NOT NULL,
    activityType ENUM('login', 'signup', 'transaction') NOT NULL,
    activityDetails TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id) REFERENCES users(id)
)
`;

// User Location Table Schema
const userLocationTableSchema = `
CREATE TABLE IF NOT EXISTS userLocations (
    locationID INT AUTO_INCREMENT PRIMARY KEY,
    id INT NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    description VARCHAR(255),
    FOREIGN KEY (id) REFERENCES users(id)
)
`;

// User Friends Table Schema
const userFriendsTableSchema = `
CREATE TABLE IF NOT EXISTS userFriends (
    friendshipID INT AUTO_INCREMENT PRIMARY KEY,
    id INT NOT NULL,
    friendid INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id) REFERENCES users(id),
    FOREIGN KEY (friendid) REFERENCES users(id)
)
`;

// User Preferences Table Schema
const userPreferencesTableSchema = `
CREATE TABLE IF NOT EXISTS userPreferences (
    preferenceID INT AUTO_INCREMENT PRIMARY KEY,
    id INT NOT NULL,
    preferenceType VARCHAR(255) NOT NULL,
    preferenceValue TEXT NOT NULL,
    FOREIGN KEY (id) REFERENCES users(id)
)
`;


// Privacy Settings Table Schema
const privacySettingsTableSchema = `
CREATE TABLE IF NOT EXISTS privacySettings (
    privacySettingID INT AUTO_INCREMENT PRIMARY KEY,
    id INT NOT NULL,
    shareActivityWithFriends BOOLEAN NOT NULL,
    FOREIGN KEY (id) REFERENCES users(id)
)
`;

// Define schema for admins table
const adminsTableSchema = `
    CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
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
        image VARCHAR(255),
        status ENUM('active', 'inactive', 'suspended'),
        lastLoginip VARCHAR(45),
        MFAEnabled BOOLEAN,
        apiKey VARCHAR(255) UNIQUE,
        token VARCHAR(255) UNIQUE
    )
`;



const bookingsTableSchema = `
CREATE TABLE IF NOT EXISTS bookings (
    bookingID INT AUTO_INCREMENT PRIMARY KEY,
    id INT,
    serviceID INT,
    providerID INT,
    scheduledTime TIMESTAMP,
    status ENUM('pending', 'confirmed', 'completed', 'canceled'),
    price DECIMAL(10, 2),
    duration INT,
    FOREIGN KEY (id) REFERENCES users(id),
    FOREIGN KEY (serviceID) REFERENCES services(id),
    FOREIGN KEY (providerID) REFERENCES users(id)
)
`;

// User History Table Schema
const userHistoryTableSchema = `
CREATE TABLE IF NOT EXISTS userHistory (
    historyID INT AUTO_INCREMENT PRIMARY KEY,
    id INT NOT NULL,
    serviceID INT NOT NULL,
    providerID INT NOT NULL,
    appointmentDate TIMESTAMP NOT NULL,
    duration INT NOT NULL,
    status ENUM('completed', 'canceled') NOT NULL,
    FOREIGN KEY (id) REFERENCES users(id),
    FOREIGN KEY (serviceID) REFERENCES services(id),
    FOREIGN KEY (providerID) REFERENCES users(id)
)
`;



// Ratings Table Schema
const ratingsTableSchema = `
CREATE TABLE IF NOT EXISTS ratings (
    ratingID INT AUTO_INCREMENT PRIMARY KEY,
    id INT NOT NULL,
    serviceID INT NOT NULL,
    providerID INT NOT NULL,
    rating INT NOT NULL,
    review TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id) REFERENCES users(id),
    FOREIGN KEY (serviceID) REFERENCES services(id),
    FOREIGN KEY (providerID) REFERENCES users(id)
)
`;


const createTables = async () => {
    const baseTables = [
        providersTableSchema, // Providers table must exist before any references
        usersTableSchema, // Users table must exist before any references
        categoriesTableSchema, // Categories must exist before services
        servicesTableSchema, // Services must exist before ratings, bookings, user history
    ];

    const dependentTables = [
        userActivityLogTableSchema, // Depends on users
        userLocationTableSchema, // Depends on users
        userFriendsTableSchema, // Depends on users
        privacySettingsTableSchema, // Depends on users
        ratingsTableSchema, // Depends on users and services
        bookingsTableSchema, // Depends on users and services
        userHistoryTableSchema, // Depends on users and services
        userPreferencesTableSchema, // Depends on users
        adminsTableSchema,
        createServiceDurationTable, // Depends on services
        createDurationTable,
        createHairTypeTable,
        adminLoginAttemptsTableSchema, // Admins is independent but kept last for any logical dependencies
    ];

    const schemas = [...baseTables, ...dependentTables];

    for (const schema of schemas) {
        pool.query(schema, (err, results) => {
            if (err) {
                console.error('Error creating table:', err.message);
                return;
            }
            console.log('Table created successfully');
        });
    }
};

// Optionally, call createTables() to initialize all tables when the module is required.
createTables();
module.exports = { pool };