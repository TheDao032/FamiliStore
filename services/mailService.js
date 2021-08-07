const knex = require('../utils/dbConnection')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const environment = require('../environments/environment')

const errorCode = 1
const successCode = 0




const sendMail = async (mailOptions, req, res) => {

    // let testAccount = await nodemailer.createTestAccount()

    // create reusable transporter object using the default SMTP transport
    const fromEmail = environment.mailConfig.user
    const password = environment.mailConfig.password
    // let transporter = nodemailer.createTransport({
    //     host: "smtp.ethereal.email",
    //     port: 587,
    //     secure: false, // true for 465, false for other ports
    //     auth: {
    //         user: environment.mailConfig.user, // generated ethereal user
    //         pass: environment.mailConfig.password, // generated ethereal password
    //     },
    // })
    var transporter = nodemailer.createTransport(`smtps://${fromEmail}:${password}@smtp.gmail.com`)

    
    await transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return res.status(400).json({
				errorMessage: 'send email fail',
				statusCode: errorCode
			})
		}
	})
}

module.exports = {
    sendMail
}