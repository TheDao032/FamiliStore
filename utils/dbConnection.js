const environment = require('../environments/environment')

const knex = require('knex')({
	client: environment.configDatabase.client,
    connection: {
    	host: environment.configDatabase.host,
		port: environment.configDatabase.port,
      	user: environment.configDatabase.user,
      	password: environment.configDatabase.password,
      	database: environment.configDatabase.dbName
    },
	pool: {
		min: environment.configDatabase.minPool,
		max: environment.configDatabase.maxPool
	}
})

module.exports = knex
