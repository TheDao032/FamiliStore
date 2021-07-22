const env = {
	ipServer: 'localhost',
	portServer: 3000,
	configDatabase: {
		client: 'pg',
		host: 'localhost',
		port: 5432,
		user: 'postgres',
		password: '',
		dbName: 'FamilyStore_db',
		minPool: 0,
		maxPool: 50
	}
}

module.exports = env
