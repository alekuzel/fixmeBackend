const express = require('express');
const bodyParser = require('body-parser');

// Import controllers
const usersController = require('./controllers/usersController');
const adminsController = require('./controllers/adminsController');
// Import other controllers as needed

const app = express();
const port = 3006;

app.use(bodyParser.json());

// Mount controllers to specific routes
app.use('/users', usersController);
app.use('/admins', adminsController);
// Mount other controllers as needed

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
