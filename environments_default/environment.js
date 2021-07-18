const env = {
	ipServer: 'localhost',
	portServer: 3000,
	configDatabase: {
		client: 'mysql2',
		host: 'localhost',
		port: 3306,
		user: 'root',
		password: '',
		dbName: 'sakila',
		minPool: 0,
		maxPool: 50
	}
}

module.exports = env
