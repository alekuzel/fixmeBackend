module.exports = {
    jwtSecret: 'your_jwt_secret_here',
    sendGridApiKey: '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',
    database: {
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        password: '1234',
        database: 'fixmeapp',
        port: 3310
    },
    nexmo: {
        apiKey: 'Y7c82ad9d',
        apiSecret: 'nG428Pze5wZicuAl',
        adminPhoneNumber: '+46764213035' // Phone number to receive SMS notifications
      }
};