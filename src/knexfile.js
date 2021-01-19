require('dotenv').config();

// Update with your config settings.

module.exports = {
  development: {
    client: 'pg',
    connection: {
      port: process.env.DB_PORT,
      host: process.env.DB_SERVER,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 20,
      propagateCreateError: false
    },
    migrations: {

    }
  },
  production: {
    client: 'pg',
    connection: {
      port: process.env.DB_PORT,
      host: process.env.DB_SERVER,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 20,
      propagateCreateError: false
    },
    migrations: {

    }
  }

};
