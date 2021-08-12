const express = require('express') 

const router = express.Router()
const knex = require('../utils/dbConnection')
const accountValidation = require('../middlewares/validation/account.validate')
const bcrypt = require('bcrypt')

const accountModel = require('../models/account.model')
const roleModel = require('../models/role.model')
const deliveryModel = require('../models/delivery.model')
const imageService = require('../services/imageService')

const successCode = 0
const errorCode = 1

router.get('/list', async (req, res) => {
	const result = await knex.from('tbl_account')

	if (result) {
		return res.status(200).json({
			listAccouts: result,
			statusCode: successCode
		})
	}

	return res.status(500).json({
		listAccounts: [],
		statusCode: errorCode
	})
})

router.get('/details/:id', async (req, res) => {
	const { id } = req.params
	
	if(isNaN(Number(id))){
		return res.status(404).json({
			message: 'id must be of integer type',
			statusCode: errorCode
		})
	}

	const result = await accountModel.findById(id)

	const deliveryAddress = await deliveryModel.findDeliveryByAccId(id)

	const responseResult = {
		email: result[0].acc_email,
		fullName: result[0].acc_full_name,
		phoneNumber: result[0].acc_phone_number,
		avatar: result[0].acc_avatar,
		deliveryAddress,
	}

	if (responseResult) {
		return res.status(200).json({
			account: responseResult,
			statusCode: successCode
		})
	}

	return res.status(500).json({ 
		account: [],
		statusCode: errorCode
	})
})

router.post('/update', accountValidation.updateAccount, async (req, res) => {
	const avatar = req.files
	const checkAvatar = avatar.image ? true : false
	const { accId, accEmail, accPhoneNumber, accFullName } = req.body
	
	let date_ob = new Date()

	const verifying = await knex('tbl_account')
						.where('acc_email', accEmail ? accEmail : '')
						.whereNot('acc_id', accId)

	if (verifying.length != 0) {
		return res.status(400).json({
			errorMessage: 'Email exist',
			statusCode: errorCode
		})
	}

	const result = await accountModel.findById(accId)

	if (checkAvatar) {
		if (result[0].acc_avatar === null) {
			await imageService.avatarUploader(avatar.image, accId, 'insert')
		} else {
			let promiseToUploadImage = new Promise(async function (resolve) {
				await imageService.avatarUploader(avatar.image, accId, 'update', result[0].acc_avatar)
				resolve();
			})
			promiseToUploadImage.then(function () {
				imageService.deleteImage(result[0].acc_avatar)
			})
		}
	}

	const account = {
		acc_email:  accEmail ? accEmail : result[0].acc_email,
		acc_phone_number: accPhoneNumber ? accPhoneNumber : result[0].acc_phone_number,
		acc_full_name: accFullName ? accFullName : result[0].acc_full_name,
		acc_updated_date: date_ob
	}

	await knex('tbl_account').where('acc_id', accId).update(account)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/update-password', accountValidation.updateAccountPassword, async (req, res) => {
	const { accId, accOldPassWord, accNewPassWord, accConfirmPassword } = req.body

	const accInfo = await accountModel.findById(accId)

	if (accInfo.length === 0) {
		return res.status(500).json({ 
			errorMessage: 'User Does Not Exist!',
			statusCode: errorCode
		})
	}

	if (!bcrypt.compareSync(accOldPassWord, accInfo[0].acc_password)) {
		return res.status(500).json({ 
			errorMessage: 'Password Incorrect!',
			statusCode: errorCode
		})
	}

	if (accNewPassWord !== accConfirmPassword) {
		return res.status(400).json({
			errorMessage: 'password is different from confirm password',
			statusCode: errorCode
		})
	}

	let date_ob = new Date()

	const hashPassword = bcrypt.hashSync(accNewPassWord, 3)
	const account = {
		acc_password: hashPassword,
		acc_updated_date: date_ob
	}

	await knex('tbl_account').where('acc_id', accId).update(account)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/delete/:id',async (req, res) => {
	const { id } = req.params

	if(isNaN(Number(id))){
		return res.status(404).json({
			message: 'id must be of integer type',
			statusCode: errorCode
		})
	}
	
	await knex('tbl_account')
		.update({ acc_status: 1 })
		.where('acc_id', id)

	return res.status(200).json({
		statusCode: successCode
	})
})

// đặt tài khoản làm nhân viên, xóa vai trò nhân viên
router.post('/update-role', accountValidation.updateRoleAccount, async (req, res) => {
	const { accId, accRole } = req.body
	const { role } = req.account

	if (!roleModel.checkAdminRole(role)) {
		return res.status(500).json({
			errorMessage: 'permission access denied'
		})
	}

	const resultRole = await roleModel.findById(accRole)
	const resultAcc = await accountModel.findById(accId)

	if (resultRole.length === 0) {
		return res.status(400).json({
			errorMessage: 'role not exists',
			statusCode: errorCode
		})
	}

	if (resultAcc.length === 0) {
		return res.status(400).json({
			errorMessage: 'account not exists',
			statusCode: errorCode
		})
	}

	await knex('tbl_account').where('acc_id', accId).update('acc_role', accRole)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/add-avatar', accountValidation.avatar, async (req, res) => {
	const { accId } = req.body
	var avatar = req.files

	const checkAvatar = avatar.image ? true : false

	const result = await accountModel.findById(accId)

	if (checkAvatar) {
		await imageService.avatarUploader(avatar.image, accId, 'insert')
	}
})

router.post('/update-avatar', accountValidation.avatar, async (req, res) => {
	const { accId } = req.body
	var avatar = req.files

	const checkAvatar = avatar.image ? true : false

	const result = await accountModel.findById(accId)

	if (checkAvatar) {
		let promiseToUploadImage = new Promise(async function (resolve) {
			await imageService.avatarUploader(avatar.image, accId, 'update', result[0].acc_avatar)
			resolve();
		})
		promiseToUploadImage.then(function () {
			imageService.deleteImage(result[0].acc_avatar)
		})
	}
})

router.post('/delete-avatar', accountValidation.avatar, async (req, res) => {
	const { accId } = req.body

	const result = await accountModel.findById(accId)

	promiseToUploadImage.then(function () {
		imageService.deleteImage(result[0].acc_avatar)
	})
})

module.exports = router
