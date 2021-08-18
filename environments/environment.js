const env = {
	portServer: process.env.PORT || 3000,
	configDatabase: {
		connectionString: 'postgres://postgres:Batman.02@localhost:5432/FamilyStore_db'
	},
	secret: process.env.SECRET || 'family_store_secret',
	APP_ID: process.env.APP_ID || 'test_id',
	APP_PASSWORD: process.env.APP_PASSWORD || 'test_password',
	APP_SCOPE: process.env.APP_SCOPE || '',
	APP_REDIRECT_URI: process.env.APP_REDIRECT_URI || 'localhost:3000',
	mailConfig: {
		user: process.env.MAIL_USER || 'nguyenthedao69@gmail.com',
	},
	CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'gvlt-qlqtpm',
	CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '999328783638897',
	CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || 'RnKQnvJ3ebzYvG_UvIZxjFD1Xcs',
	SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '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'
}

module.exports = env