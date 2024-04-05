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

app.post('/admin/login', authenticateAdmin, (req, res) => {
    res.json({ message: 'Authentication successful', admin: req.admin });
});

//protected route
app.get('/admin/dashboard', authenticateAdmin, (req, res) => {
    res.json({ message: 'Admin dashboard', admin: req.admin });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
