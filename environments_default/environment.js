const env = {
	ipServer: 'localhost',
	portServer: 3000,
	configDatabase: {
		client: 'pg',
		host: 'localhost',
		port: 5432,
		user: 'postgres',
		password: '2705',
		dbName: 'FamilyStore_db',
		minPool: 0,
		maxPool: 50
	},
	secret: 'family_store_secret',
	APP_ID: 'test_id',
	APP_PASSWORD: 'test_password',
	APP_SCOPE: '',
	APP_REDIRECT_URI: 'localhost:3000'
}

module.exports = env
