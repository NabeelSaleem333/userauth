const { connection } = require("mongoose");

const devConfig = {
    PORT: process.env.PORT || 4000,
    connectionString: 'mongodb://localhost/userauth',
    secretKey: 'gmail'
}
module.exports = devConfig;