module.exports = {
  development: {
      client: 'pg',
      connection: 'postgres://postgres:123456@localhost:5433/FamilyStore2_db',
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
