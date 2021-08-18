const env = {
	ipServer: 'localhost',
	portServer: process.env.PORT || 3000,
	configDatabase: {
		connectionString: 'postgres://postgres:123456@127.0.0.1:5433/FamilyStore_db'
	},
	secret: process.env.SECRET || 'family_store_secret',
	APP_ID: process.env.APP_ID || 'test_id',
	APP_PASSWORD: process.env.APP_PASSWORD || 'test_password',
	APP_SCOPE: process.env.APP_SCOPE || '',
	APP_REDIRECT_URI: process.env.APP_REDIRECT_URI || 'localhost:3000',
	mailConfig: {
		user: process.env.MAIL_USER || 'family.store.bot@gmail.com',
		password: process.env.MAIL_PASSWORD || 'Nn123456789@@'
	}
}

module.exports = env