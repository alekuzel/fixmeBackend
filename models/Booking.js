const { pool } = require('../database'); 

class Booking {
    static async createBooking(id, serviceID, providerID, scheduledTime, status, price, duration) {
        try {
            const newBooking = await pool.query(
                'INSERT INTO bookings (id, serviceID, providerID, scheduledTime, status, price, duration) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [id, serviceID, providerID, scheduledTime, status, price, duration]
            );
            return newBooking.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async getAllBookings() {
        try {
            const allBookings = await pool.query('SELECT * FROM bookings');
            return allBookings.rows;
        } catch (error) {
            throw error;
        }
    }

    static async getBookingByID(bookingID) {
        try {
            const booking = await pool.query('SELECT * FROM bookings WHERE bookingID = $1', [bookingID]);
            return booking.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async updateBookingByID(bookingID, id, serviceID, providerID, scheduledTime, status, price, duration) {
        try {
            const updatedBooking = await pool.query(
                'UPDATE bookings SET id = $1, serviceID = $2, providerID = $3, scheduledTime = $4, status = $5, price = $6, duration = $7 WHERE bookingID = $8 RETURNING *',
                [id, serviceID, providerID, scheduledTime, status, price, duration, bookingID]
            );
            return updatedBooking.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async deleteBookingByID(bookingID) {
        try {
            await pool.query('DELETE FROM bookings WHERE bookingID = $1', [bookingID]);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Booking;
