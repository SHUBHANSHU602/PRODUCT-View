const dotenv = require("dotenv");
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
};

module.exports = config;
