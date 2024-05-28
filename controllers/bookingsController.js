// Import necessary modules and models
const { pool } = require('../database'); // Assuming you have a database connection pool


// Create booking
exports.createBooking = async (req, res) => {
    try {
        const { id, serviceID, providerID, scheduledTime, status, price, duration } = req.body;

        // Validate input data
        const { error } = validateBooking(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const newBooking = await pool.query(
            'INSERT INTO bookings (id, serviceID, providerID, scheduledTime, status, price, duration) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [id, serviceID, providerID, scheduledTime, status, price, duration]
        );

        res.json(newBooking.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
    try {
        const allBookings = await pool.query('SELECT * FROM bookings');
        res.json(allBookings.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
};

// Get booking by ID
exports.getBookingByID = async (req, res) => {
    try {
        const { bookingID } = req.params;
        const booking = await pool.query('SELECT * FROM bookings WHERE bookingID = $1', [bookingID]);
        
        if (booking.rows.length === 0) {
            return res.status(404).send('Booking not found');
        }

        res.json(booking.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
};

// Update booking by ID
exports.updateBookingByID = async (req, res) => {
    try {
        const { bookingID } = req.params;
        const { id, serviceID, providerID, scheduledTime, status, price, duration } = req.body;

        // Validate input data
        const { error } = validateBooking(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const updatedBooking = await pool.query(
            'UPDATE bookings SET id = $1, serviceID = $2, providerID = $3, scheduledTime = $4, status = $5, price = $6, duration = $7 WHERE bookingID = $8 RETURNING *',
            [id, serviceID, providerID, scheduledTime, status, price, duration, bookingID]
        );

        res.json(updatedBooking.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
};

// Delete booking by ID
exports.deleteBookingByID = async (req, res) => {
    try {
        const { bookingID } = req.params;
        await pool.query('DELETE FROM bookings WHERE bookingID = $1', [bookingID]);
        res.send('Booking deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
};
