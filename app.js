// app.js

const express = require('express');
const database = require('./database'); // Import the database module

const app = express();

// Define your routes and other middleware here

const port = process.env.PORT || 3010;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
