
const sgMail = require('@sendgrid/mail');
const config = require('../config.js');
const crypto = require('crypto');

// Set your SendGrid API key
sgMail.setApiKey(config.sendGridApiKey);

const generateUniqueToken = () => {
    return crypto.randomBytes(20).toString('hex'); // Generate a random token (you can adjust the length as needed)
};

const sendConfirmationEmail = async (email, token) => {
    const confirmationLink = `http://localhost:3001/confirm?token=${token}`; // Use the confirmation token

    const msg = {
        to: email,
        from: 'a.brods@gmail.com', // LATER no-reply@fixmeapp.se
        subject: 'Confirm Your Registration',
        html: `<p>Please click the following link to confirm your registration: <a href="${confirmationLink}">${confirmationLink}</a></p>`,
    };

    try {
        await sgMail.send(msg);
        console.log('Confirmation email sent successfully');
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        throw new Error('Failed to send confirmation email');
    }
};

const sendResetPasswordEmail = async (email, token) => {
    const resetLink = `http://localhost:3001/reset-password?token=${token}`; // Use the reset token

    const msg = {
        to: email,
        from: 'a.brods@gmail.com', // Use the email address you verified with SendGrid
        subject: 'Reset Your Password',
        html: `<p>Please click the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
    };

    try {
        await sgMail.send(msg);
        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
};

module.exports = { sendConfirmationEmail, sendResetPasswordEmail };
