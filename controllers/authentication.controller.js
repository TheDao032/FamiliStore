const express = require('express')
const jsonWebToken = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const randomstring = require('randomstring')

const router = express.Router()
const knex = require('../utils/dbConnection')
const environment = require('../environments/environment')

const authenticationService = require('../services/authenticationService')
const authenticationValidate = require('../middlewares/validation/authentication.validate')
const mailService = require('../services/mailService')

const accountModel = require('../models/account.model')

const errorCode = 1
const successCode = 0

router.post('/login', authenticationValidate.login, (req, res) => {
	const { email, passWord } = req.body

	authenticationService.authenticate(email, passWord, async (err, auth = null, user = null) => {
		if (err) {
			res.status(401).json({
				err,
				statusCode: 2
			})
			return
		}

		const accessToken = jsonWebToken.sign(auth, environment.secret, {
			expiresIn: '1h',
			algorithm: 'HS256'
		})

		var refreshToken = randomstring.generate(100)

		await accountModel.updateRefreshToken(user.accId, refreshToken)

		res.status(200).json({
			statusCode: successCode,
			data: {
				user,
				accessToken,
				refreshToken
			}
		})
	}, req, res)
})

router.post('/register', authenticationValidate.register, async (req, res) => {
	const {passWord, email, fullName, phoneNumber, role } = req.body
	let dateOb = new Date()

	// check unique email
	const verifying = await accountModel.findByEmail(email)

	if (verifying.length != 0) {
		return res.status(400).json({
			errorMessage: 'Email existed',
			statusCode: errorCode
		})
	}

	if (role) {
		const rowRole = await knex('tbl_roles').where('rol_id', role)
		if(rowRole.length === 0){
			return res.status(400).json({
				errorMessage: 'role not existed',
				statusCode: errorCode
			})
		}
	}

	var token = (Math.floor(Math.random() * (99999 - 10000)) + 10000).toString()

	const cusName = fullName || 'quý khách'
	
	await mailService.sendMail(email, cusName, token, req, res)

	const hashPassword = bcrypt.hashSync(passWord, 3)
	const hashToken = bcrypt.hashSync(token, 3)

	// add account
	const account = {
		acc_password: hashPassword,
		acc_email: email,
		acc_phone_number: phoneNumber || null,
		acc_full_name: fullName || null,
		acc_role: role || 'USER',
		acc_token: hashToken,
		acc_avatar: req.files ? req.files.picture.data : null,
		acc_created_date: dateOb,
		acc_updated_date: null
	}

	const newAccId = await knex('tbl_account')
	.returning('acc_id')
	.insert(account)

	return res.status(200).json({
		statusCode: successCode,
		accId: newAccId[0]
	})
})

router.post('/verification-email', authenticationValidate.confirmToken, async (req, res) => {
	const { accId, accToken }  = req.body

	let dateOb = new Date()
	const result = await accountModel.findById(accId)

	if (result.length === 0) {
		return res.status(400).json({
			errorMessage: 'id not exist',
			statusCode: errorCode
		})
	}

	if(result[0].acc_token === null){
		return res.status(400).json({
			errorMessage: 'user has already vefified',
			statusCode: errorCode
		})
	}

	if (!bcrypt.compareSync(accToken, result[0]['acc_token'])) {
		return res.status(400).json({
			errorMessage: 'verify email fail',
			statusCode: errorCode
		})
	}

	var account = {
		acc_token: null,
		acc_status: 0,
		acc_updated_date: dateOb
	}
	
	await knex('tbl_account').where('acc_id', accId).update(account)

	return res.status(200).json({
		statusCode: successCode
	})
	
})

router.post('/verification-forgot', authenticationValidate.confirmToken, async (req, res) => {
	const { accId, accToken }  = req.body

	let dateOb = new Date()
	const result = await accountModel.findById(accId)

	if (result.length === 0) {
		return res.status(400).json({
			errorMessage: 'id not exist',
			statusCode: errorCode
		})
	}

	if (result[0].acc_token_forgot === null) {
		return res.status(400).json({
			errorMessage: 'user has already vefified',
			statusCode: errorCode
		})
	}

	if (!bcrypt.compareSync(accToken, result[0]['acc_token_forgot'])) {
		return res.status(400).json({
			errorMessage: 'verify forgot faill',
			statusCode: errorCode
		})
	}

	var account = {
		acc_token_forgot: null,
		acc_updated_date: dateOb
	}
	
	await knex('tbl_account').where('acc_id', accId).update(account)

	var token = (Math.floor(Math.random() * (99999 - 10000)) + 10000).toString()
	const hashToken = bcrypt.hashSync(token, 3)
	const updateAccount = {
		acc_token_forgot: token
	}

	await knex('tbl_account').where('acc_id', accId).update(updateAccount)

	return res.status(200).json({
		tokenChangePass: hashToken,
		statusCode: successCode
	})
})

router.post('/forgot-password', authenticationValidate.forgotPassword, async (req, res) => {
	const { email }  = req.body

	let dateOb = new Date()
	const result = await accountModel.findByEmail(email)

	if (result.length === 0) {
		return res.status(400).json({
			errorMessage: 'email not exist',
			statusCode: errorCode
		})
	}

	var token = 'f' + (Math.floor(Math.random() * (99999 - 10000)) + 10000).toString()

	const cusName = result[0]['acc_fullName'] || 'quý khách'
	await mailService.sendMail(email, cusName, token, req, res)
	const hashToken = bcrypt.hashSync(token, 3)
	
	const account = {
		acc_token_forgot: hashToken,
		acc_updated_date: dateOb
	}

	await knex('tbl_account').where('acc_id', result[0]['acc_id']).update(account)

	return res.status(200).json({
		statusCode: successCode,
		accId: result[0]['acc_id']
	})
})

router.post('/new-password', authenticationValidate.newPassword, async (req, res) => {
	const { accId, accPassword, tokenChangePass }  = req.body

	let dateOb = new Date()
	const result = await accountModel.findById(accId)

	if (result.length === 0) {
		return res.status(400).json({
			errorMessage: 'id not exists',
			statusCode: errorCode
		})
	}

	if (!bcrypt.compareSync(result[0]['acc_token_forgot'], tokenChangePass)) {
		return res.status(400).json({
			errorMessage: 'token chage password wrong',
			statusCode: errorCode
		})
	}

	const hashPassWord = bcrypt.hashSync(accPassword, 3)
	const account = {
		acc_password: hashPassWord,
		acc_token_forgot: null,
		acc_updated_date: dateOb
	}

	await knex('tbl_account').where('acc_id', accId).update(account)
	
	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/refresh-token', authenticationValidate.refreshToken, async (req, res) => {
	const { accessToken, refreshToken } = req.body

	await jsonWebToken.verify(accessToken, environment.secret, { ignoreExpiration: true }, async (err, decode) => {
        if (err) {
			return res.status(401).json({
                err,
                statusCode: 3,
            })
		}

		const { accId } = decode

		if (accountModel.isValidRefreshToken(accId, refreshToken)) {
			const newAccessToken = jsonWebToken.sign(auth, environment.secret, {
				expiresIn: '1h',
				algorithm: 'HS256'
			})
			
			res.status(200).json({
				statusCode: successCode,
				accessToken: newAccessToken
			})
		}

		return res.status(401).json({
			errorMessage: 'InValid Refresh Token',
			statusCode: 2,
		})
    })
})

module.exports = router
