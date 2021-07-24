const express = require('express')

const router = express.Router()

const jsonWebToken = require('jsonwebtoken')
const authenticationService = require('../services/authenticationService')
const authentication = require('../middlewares/authentication')
const environment = require('../environments/environment')
const nodemailer = require('nodemailer')
const knex = require('../utils/dbConnection')

const errorCode = 1
const successCode = 0

router.post('/login', (req, res) => {
	const { username, password } = req.body
	if (!username || !password) {
		return res.status(400).json({
			errorMessage: 'Bad Request',
			code: errorCode
		})
	}
	authenticationService.authenticate(username, password, (err, auth = null, user = null) => {
		if (err) {
			res.status(401).json({
				err,
				code: 2
			})
			return
		}
		const token = jsonWebToken.sign(auth, environment.secret, {
			expiresIn: '24h',
			algorithm: 'HS256'
		})
		res.status(200).json({
			code: successCode,
			data: {
				user,
				token
			}
		})
	})
});
router.post('/register', async (req, res) => {
	const acc = req.body;
	let date_ob = new Date();
	if(!acc.username || !acc.password || !acc.email){
		return res.status(400).json({
			errorMessage: 'register faill',
			code: errorCode
		})
	}
	// check unique username and email
	const verifying = await knex('tbl_account').where('acc_username', acc.username).orWhere('acc_email', acc.email).select('acc_id');
	if(verifying.length != 0){
		return res.status(400).json({
			errorMessage: 'username or email exist',
			code: errorCode
		})
	}

	// send email
	var code = (Math.floor(Math.random() * (99999 - 10000)) + 10000).toString();
	var transporter = nodemailer.createTransport('smtps://vsthien1212%40gmail.com:thien123456@smtp.gmail.com');

	const fullname = acc.full_name || 'quý khách';
	var mailOptions = {
		from: '<vsthien1212@gmail.com>',
		to: `${acc.email}`,
		subject: 'Xác nhận Email',
		html: `<h1>Chào ${fullname} thân mến! </h1><br>
           <h3>Bạn đã chọn ${acc.email} sử dung email để đăng ký tài khoản Famali Store, chào mừng bạn đến với trang thương mại điện tử của chúng tôi:</h3>
           <h3>Mã Xác minh: ${code}</h3><br>
           <h3>Lưu ý: Vui lòng không cung cấp mã này cho bất kì ai, mã xác minh chỉ được sử dụng 1 lần.</h3><br>
           <h3>Trân trọng!</h3>`
		//text: `1234sdadsa sad ${a}`
	};

	transporter.sendMail(mailOptions, async function (error, info) {
		if (error) {
			return res.status(400).json({
				errorMessage: 'send email faill',
				code: errorCode
			})
		} else {
			console.log('send email thanh cong');
			//console.log('Email sent: ' + info.response);
		}
	});
	// add account
	const result = await knex('tbl_account').max('acc_id as maxId').first()
	const account = {
		acc_id: +result['maxId'] + 1,
		acc_username: acc.username,
		acc_password: acc.password,
		acc_email: acc.email,
		acc_phone_number: acc.phone_number || null,
		acc_full_name: acc.full_name || null,
		acc_role: acc.role || 1,
		acc_avatar: acc.avatar || null,
		acc_status: acc.status || null,
		acc_created_date: date_ob,
		acc_updated_date: null
	}
	await knex('tbl_account').insert(account).catch((error) => {
		return res.status(500).json({
			errorMessage: error,
			statusCode: errorCode
		})
	})

	return res.status(200).json({
		statusCode: successCode
	})
});
router.post('/VerificationEmail', async (req, res) => {
	
	
	return res.status(200).json({
		statusCode: successCode
	})
});

module.exports = router
