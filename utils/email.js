const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');

// Set your SendGrid API key
sgMail.setApiKey('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');

const generateUniqueToken = () => {
    return crypto.randomBytes(20).toString('hex'); // Generate a random token (you can adjust the length as needed)
};

const sendConfirmationEmail = async (email) => {
    const token = generateUniqueToken();
    const confirmationLink = `http://localhost:3000/confirm?token=${token}`; // Using your local development URL

    const msg = {
        to: email,
        from: 'a.brods@gmail.com', // Use the email address you verified with SendGrid
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

module.exports = { sendConfirmationEmail };
