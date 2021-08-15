const env = {
	ipServer: '192.168.10.101',
	portServer: process.env.PORT || 3000,
	configDatabase: {
		connectionString: 'postgres://<usernameDB>:<passwordDB>@<host>:<port>/<dbName'
	},
	secret: process.env.SECRET || 'family_store_secret',
	APP_ID: process.env.APP_ID || 'test_id',
	APP_PASSWORD: process.env.APP_PASSWORD || 'test_password',
	APP_SCOPE: process.env.APP_SCOPE || '',
	APP_REDIRECT_URI: process.env.APP_REDIRECT_URI || 'localhost:3000',
	mailConfig: {
		user: process.env.MAIL_USER || '<>@gmail.com',
	},
	CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'default',
	CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || 'default',
	CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || 'default',
	SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || 'default'

}

module.exports = env
