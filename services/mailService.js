const knex = require('../utils/dbConnection')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const environment = require('../environments/environment')

const errorCode = 1
const successCode = 0

const sendMail = async (email, cusName, token, req, res) => {

    // let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    const fromEmail = environment.mailConfig.user
    const password = environment.mailConfig.password
    console.log(fromEmail)
    console.log(environment.mailConfig.password)
    // let transporter = nodemailer.createTransport({
    //     host: "smtp.ethereal.email",
    //     port: 587,
    //     secure: false, // true for 465, false for other ports
    //     auth: {
    //         user: environment.mailConfig.user, // generated ethereal user
    //         pass: environment.mailConfig.password, // generated ethereal password
    //     },
    // });
    var transporter = nodemailer.createTransport(`smtps://${fromEmail}:${password}@smtp.gmail.com`)

    var mailOptions = {
		from: `<${fromEmail}>`,
		to: `${email}`,
		subject: 'Xác nhận Email',
		html: `<h1>Chào ${cusName} thân mến! </h1><br>
           <h3>Bạn đã chọn ${email} sử dung email để đăng ký tài khoản Famali Store, chào mừng bạn đến với trang thương mại điện tử của chúng tôi:</h3>
           <h3>Mã Xác minh: ${token}</h3><br>
           <h3>Lưu ý: Vui lòng không cung cấp mã này cho bất kì ai, mã xác minh chỉ được sử dụng 1 lần.</h3><br>
           <h3>Trân trọng!</h3>`
		//text: `1234sdadsa sad ${a}`
	}

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