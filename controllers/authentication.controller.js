const express = require('express')

const router = express.Router()

const jsonWebToken = require('jsonwebtoken')
const authenticationService = require('../services/authenticationService')
const authentication = require('../middlewares/authentication')
const environment = require('../environments/environment')
const nodemailer = require('nodemailer')
const knex = require('../utils/dbConnection')
const bcrypt = require('bcrypt')

const errorCode = 1
const successCode = 0

router.post('/login', (req, res) => {
	const { userName, passWord } = req.body
	if (!userName || !passWord) {
		return res.status(400).json({
			errorMessage: 'Bad Request',
			code: errorCode
		})
	}
	authenticationService.authenticate(userName, passWord, (err, auth = null, user = null) => {
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
})

router.post('/register', async (req, res) => {
	const { userName, passWord, email, fullName, phoneNumber, role, avatar, status } = req.body
	let dateOb = new Date()
	if (!userName || userName === '' || !passWord || passWord === '' || !email || email === '') {
		return res.status(400).json({
			errorMessage: 'Bad Request',
			code: errorCode
		})
	}

	// check unique username and email
	const verifying = await knex('tbl_account').where('acc_username', userName).orWhere('acc_email', email)
	if (verifying.length != 0) {
		return res.status(400).json({
			errorMessage: 'username or email existed',
			code: errorCode
		})
	}

	// send email
	var token = (Math.floor(Math.random() * (99999 - 10000)) + 10000).toString()
	var transporter = nodemailer.createTransport('smtps://vsthien1212%40gmail.com:thien123456@smtp.gmail.com')

	fullName = fullName || 'quý khách'
	var mailOptions = {
		from: '<vsthien1212@gmail.com>',
		to: `${email}`,
		subject: 'Xác nhận Email',
		html: `<h1>Chào ${fullName} thân mến! </h1><br>
           <h3>Bạn đã chọn ${email} sử dung email để đăng ký tài khoản Famali Store, chào mừng bạn đến với trang thương mại điện tử của chúng tôi:</h3>
           <h3>Mã Xác minh: ${token}</h3><br>
           <h3>Lưu ý: Vui lòng không cung cấp mã này cho bất kì ai, mã xác minh chỉ được sử dụng 1 lần.</h3><br>
           <h3>Trân trọng!</h3>`
		//text: `1234sdadsa sad ${a}`
	}

	transporter.sendMail(mailOptions, async function (error, info) {
		if (error) {
			return res.status(400).json({
				errorMessage: 'send email faill',
				code: errorCode
			})
		} 
		return res.status(200).json({
			code: successCode
		})
	})
	const hashPassword = bcrypt.hashSync(passWord, 3)
	const hashToken = bcrypt.hashSync(token, 3)
	// add account
	const result = await knex('tbl_account').max('acc_id as maxId').first()
	const account = {
		acc_id: +result['maxId'] + 1,
		acc_username: userName,
		acc_password: hashPassword,
		acc_email: email,
		acc_phone_number: phoneNumber || null,
		acc_full_name: fullName || null,
		acc_role: role || 1,
		acc_token: hashToken,
		acc_avatar: avatar || null,
		acc_status: status || null,
		acc_created_date: dateOb,
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
})

router.post('/verification-email', async (req, res) => {
	const { accId, accToken }  = req.body
	let dateOb = new Date()
	const result = await knex.from('tbl_account').where('acc_id', accId)
	if (result.length === 0) {
		return res.status(400).json({
			errorMessage: 'id not exist',
			code: errorCode
		})
	}

	if (!bcrypt.compareSync(accToken, result[0]['acc_token'])) {
		return res.status(400).json({
			errorMessage: 'verify email faill',
			code: errorCode
		})
	}

	const account = {
		acc_token: null,
		acc_status: 0,
		acc_updated_date: dateOb
	}
	await knex('tbl_account').where('acc_id', accId).update(account).catch((error) => {
		return res.status(500).json({
			errorMessage: error,
			statusCode: errorCode
		})
	})

	return res.status(200).json({
		statusCode: successCode
	})
})

module.exports = router
