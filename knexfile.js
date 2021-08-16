const environment = require('./environments/environment')

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
    connection: process.env.DATABASE_URL || environment.configDatabase.connectionString,
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
