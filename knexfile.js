const environment = require('./environments/environment')
require('dotenv').config()

module.exports = {
  development: {
      client: 'pg',
      connection: environment.configDatabase.connectionString,
      // migrations: {
      //     directory: __dirname + '/db/migrations',
      //   },
      // seeds: {
      //     directory: __dirname + '/db/seeds',
      //   },
    },
  test: {
    client: 'pg',
    connection: process.env.TEST_CONNECTION,
    // migrations: {
    //     directory: __dirname + '/db/migrations',
    //   },
    // seeds: {
    //     directory: __dirname + '/db/seeds',
    //   },
  },
  production: {
      client: 'pg',
      connection: process.env.DATABASE_URL,
      // migrations: {
      //     directory: __dirname + '/db/migrations',
      //   },
      // seeds: {
      //     directory: __dirname + '/db/seeds',
      //   },
    },
};
