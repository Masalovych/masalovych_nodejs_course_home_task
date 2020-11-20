const _dialect = 'mysql';
const logger = require('../../server/helpers/logger');

const logging = logger.info;
require('dotenv').config();

const _port = 3306;

module.exports = {
  development: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_URL,
    port: _port,
    dialect: _dialect,
    logging,
    define: {
      timestamp: true
    }
  },
  test: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_URL,
    port: _port,
    dialect: _dialect,
    logging,
    define: {
      timestamp: true
    }
  },
  production: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_URL,
    port: _port,
    dialect: _dialect,
    logging,
    define: {
      timestamp: true
    }
  }
};