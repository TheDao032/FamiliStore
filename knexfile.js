const environment = require('./environments/environment')

module.exports = {
  development: {
      client: 'pg',
<<<<<<< HEAD
      connection: 'postgres://postgres:Batman.02@localhost:5432/FamilyStore_db',
=======
      connection: environment.configDatabase.connectionString,
>>>>>>> 3b21e07a773cbda43518360abe26e9fa26a96315
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
