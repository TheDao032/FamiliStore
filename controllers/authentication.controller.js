const express = require('express')
const jsonWebToken = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')

const router = express.Router()
const knex = require('../utils/dbConnection')
const environment = require('../environments/environment')

const authenticationService = require('../services/authenticationService')
const authentication = require('../middlewares/authentication')
const validation = require('../middlewares/validation')
const mailService = require('../services/mailService')

const errorCode = 1
const successCode = 0

router.post('/login', validation.login, (req, res) => {
	const { email, passWord } = req.body

	authenticationService.authenticate(email, passWord, (err, auth = null, user = null) => {
		if (err) {
			res.status(401).json({
				err,
				statusCode: 2
			})
			return
		}
		const token = jsonWebToken.sign(auth, environment.secret, {
			expiresIn: '24h',
			algorithm: 'HS256'
		})
		res.status(200).json({
			statusCode: successCode,
			data: {
				user,
				token
			}
		})
	}, req, res)
})

router.post('/register', validation.newAccount, async (req, res) => {
	const {passWord, email, fullName, phoneNumber, role } = req.body
	let dateOb = new Date()

	// check unique email
	const verifying = await knex('tbl_account').where('acc_email', email)
	if (verifying.length != 0) {
		return res.status(400).json({
			errorMessage: 'Email existed',
			statusCode: errorCode
		})
	}
	if(role){
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

	await knex('tbl_account').insert(account)
	const acc_id = await knex('tbl_account').where('acc_email', email).select('acc_id')
	return res.status(200).json({
		statusCode: successCode,
		accId: acc_id[0].acc_id
	})
})

router.post('/verification-email', validation.comfirmToken, async (req, res) => {
	const { accId, accToken }  = req.body
	let dateOb = new Date()
	const result = await knex.from('tbl_account').where('acc_id', accId)
	if (result.length === 0) {
		return res.status(400).json({
			errorMessage: 'id not exist',
			statusCode: errorCode
		})
	}
	if(result[0].acc_token === null){
		return res.status(400).json({
			errorMessage: 'user does not have a verification code',
			statusCode: errorCode
		})
	}

	if (!bcrypt.compareSync(accToken, result[0]['acc_token'])) {
		return res.status(400).json({
			errorMessage: 'verify email faill',
			statusCode: errorCode
		})
	}

	var account = {}
	if(accToken.length === 5){
		account = {
			acc_token: null,
			acc_status: 0,
			acc_updated_date: dateOb
		}
	}
	else{
		account = {
			acc_tokenForgot: null,
			acc_updated_date: dateOb
		}
	}
	
	await knex('tbl_account').where('acc_id', accId).update(account).catch((error) => {
		return res.status(500).json({
			errorMessage: error,
			statusCode: errorCode
		})
	})
	if(accToken.length === 5){
		return res.status(200).json({
			statusCode: successCode
		})
	}

	var token = (Math.floor(Math.random() * (99999 - 10000)) + 10000).toString()
	const hashToken = bcrypt.hashSync(token, 3)
	const updateAccount = {
		acc_token: token
	}

	await knex('tbl_account').where('acc_id', accId).update(updateAccount).catch((error) => {
		return res.status(500).json({
			errorMessage: error,
			statusCode: errorCode
		})
	})

	
	return res.status(200).json({
		tokenChangePass: hashToken,
		statusCode: successCode
	})
	
})

router.post('/forgot-password', validation.forgotPassword, async (req, res) => {
	const { email }  = req.body
	let dateOb = new Date()
	const result = await knex.from('tbl_account').where('acc_email', email)
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
		acc_token: hashToken,
		acc_updated_date: dateOb
	}
	await knex('tbl_account').where('acc_id', result[0]['acc_id']).update(account).catch((error) => {
		return res.status(500).json({
			errorMessage: error,
			statusCode: errorCode
		})
	})

	return res.status(200).json({
		statusCode: successCode,
		accId: result[0]['acc_id']
	})
})

router.post('/new-password',validation.newPassword, async (req, res) => {
	const { accId, accPassword, TokenChangePass }  = req.body
	let dateOb = new Date()
	const result = await knex.from('tbl_account').where('acc_id', accId)
	if (result.length === 0) {
		return res.status(400).json({
			errorMessage: 'id not exists',
			statusCode: errorCode
		})
	}
	if(!bcrypt.compareSync(result[0]['acc_token'], TokenChangePass)){
		return res.status(400).json({
			errorMessage: 'token chage password wrong',
			statusCode: errorCode
		})
	}
	const hashPassWord = bcrypt.hashSync(accPassword, 3)
	const account = {
		acc_password: hashPassWord,
		acc_token: null,
		acc_updated_date: dateOb
	}

	await knex('tbl_account').where('acc_id', accId).update(account)
	return res.status(200).json({
		statusCode: successCode
	})
})

module.exports = router
