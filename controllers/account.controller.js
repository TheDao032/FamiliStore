const express = require('express')

const router = express.Router()
const knex = require('../utils/dbConnection')
const accountValidation = require('../middlewares/validation/account.validate')
const bcrypt = require('bcrypt')

const accountModel = require('../models/account.model')
const roleModel = require('../models/role.model')
const deliveryModel = require('../models/delivery.model')
const imageService = require('../services/imageService')
const imageValidator = require('../middlewares/validation/image.validate')
const successCode = 0
const errorCode = 1

router.get('/list', async (req, res) => {
	const { page, limit } = req.query

	const allAccount = await accountModel.findAll()

	const result = await Promise.all([
		allAccount.map((element) => {
			return {
				accId: element.acc_id,
				accEmail: element.acc_email,
				accPhoneNumber: element.acc_phone_number,
				accFullName: element.acc_full_name,
				accAvatar: element.acc_avatar,
				accStatus: element.acc_status,
				accRole: element.acc_role === 'ADM' ? 'Admin' : 'User'
			}
		})
	])

	if (result) {
		result.sort((a, b) => a - b)

		if (page || limit) {
			let startIndex = (parseInt(page) - 1) * parseInt(limit)
			let endIndex = (parseInt(page) * parseInt(limit))
			let totalPage = Math.floor(result[0].length / parseInt(limit))

			if (result[0].length % parseInt(limit) !== 0) {
				totalPage = totalPage + 1
			}

			const paginationResult = result[0].slice(startIndex, endIndex)

			return res.status(200).json({
				totalPage: totalPage,
				listAccounts: paginationResult,
				statusCode: successCode
			})
		}

		return res.status(200).json({
			listAccounts: result[0],
			statusCode: successCode
		})
	}

	return res.status(200).json({
		listAccounts: [],
		statusCode: errorCode
	})
})

router.get('/details/:id', accountValidation.paramsInfo, async (req, res) => {
	const { id } = req.params
	const { accRole } = req.account
	
	let accIdFlag = id

	if (!roleModel.checkAdminRole(accRole)) {
		accIdFlag = req.account.accId
	}

	const accInfo = await accountModel.findById(accIdFlag)

	if (accInfo.length === 0) {
		return res.status(200).json({
			account: [],
			statusCode: errorCode
		})
	}

	const deliveryAddress = await deliveryModel.findDeliveryByAccId(accIdFlag)

	const responseResult = {
		accEmail: accInfo[0].acc_email,
		accFullName: accInfo[0].acc_full_name,
		accPhoneNumber: accInfo[0].acc_phone_number,
		accAvatar: accInfo[0].acc_avatar,
		deliveryAddress: deliveryAddress[0]
	}

	return res.status(200).json({
		account: responseResult,
		statusCode: successCode
	})
})

router.post('/update', accountValidation.updateAccount, async (req, res) => {
	let checkAvatar = false

	const { accId, accEmail, accPhoneNumber, accFullName } = req.body

	const { accOldPassword, accNewPassword, accConfirmPassword } = req.body

	if ((accOldPassword && accOldPassword !== '') || (accNewPassword && accNewPassword !== '') || (accConfirmPassword && accConfirmPassword !== '')) {
		if (!accOldPassword || accOldPassword === '' || !accNewPassword || accNewPassword === '' || !accConfirmPassword || accConfirmPassword === '') {
			return res.status(400).json({
				errorMessage: `Can't Update Password, Missing Information`
			})
		}

		const { accRole } = req.account

		if (roleModel.checkAdminRole(accRole)) {
			return res.status(400).json({
				errorMessage: `Permission Denied`,
				statusCode: errorCode
			})
		}

		const result = await accountModel.findById(req.account.accId)

		if (!bcrypt.compareSync(accOldPassword, result[0].acc_password)) {
			return res.status(400).json({
				errorMessage: 'Password Incorrect!',
				statusCode: errorCode
			})
		}
	
		if (accNewPassword !== accConfirmPassword) {
			return res.status(400).json({
				errorMessage: 'password is different from confirm password',
				statusCode: errorCode
			})
		}
		
		let date_ob = new Date()
		const hashPassword = bcrypt.hashSync(accNewPassword, 3)

		if (accEmail && accEmail !== '') {
			const emailInfo = await knex('tbl_account')
				.where('acc_email', accEmail ? accEmail : '')
				.whereNot('acc_id', req.account.accId)

			if (emailInfo.length != 0) {
				return res.status(400).json({
					errorMessage: 'Email exist',
					statusCode: errorCode
				})
			}
		}

		const account = {
			acc_email: accEmail ? accEmail : result[0].acc_email,
			acc_phone_number: accPhoneNumber ? accPhoneNumber : result[0].acc_phone_number,
			acc_full_name: accFullName ? accFullName : result[0].acc_full_name,
			acc_password: hashPassword,
			acc_updated_date: date_ob
		}

		await knex('tbl_account').where('acc_id', req.account.accId).update(account)

		return res.status(200).json({
			statusCode: successCode
		})
	}

	const { accRole } = req.account
	let accIdFlag = req.account.accId
	if (accId) {
		if (roleModel.checkAdminRole(accRole)) {
			accIdFlag = accId
		}
	}

	let date_ob = new Date()

	if (accEmail && accEmail !== '') {
		const emailInfo = await knex('tbl_account')
			.where('acc_email', accEmail ? accEmail : '')
			.whereNot('acc_id', accIdFlag)

		if (emailInfo.length != 0) {
			return res.status(400).json({
				errorMessage: 'Email exist',
				statusCode: errorCode
			})
		}
	}

	const result = await accountModel.findById(accIdFlag)

	if (result.length === 0) {
		res.status(400).json({
			errorMessage: 'Account Does Not Exist',
			statusCode: errorCode
		})
	}

	const account = {
		acc_email: accEmail ? accEmail : result[0].acc_email,
		acc_phone_number: accPhoneNumber ? accPhoneNumber : result[0].acc_phone_number,
		acc_full_name: accFullName ? accFullName : result[0].acc_full_name,
		acc_updated_date: date_ob
	}

	await knex('tbl_account').where('acc_id', accIdFlag).update(account)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/update-password', accountValidation.updateAccountPassword, async (req, res) => {
	const { accId, accOldPassword, accNewPassword, accConfirmPassword } = req.body

	const { accRole } = req.account
	let accIdFlag = req.account.accId
	if (accId) {
		if (roleModel.checkAdminRole(accRole)) {
			accIdFlag = accId
		}
	}

	const accInfo = await accountModel.findById(accIdFlag)

	if (accInfo.length === 0) {
		return res.status(400).json({
			errorMessage: 'User Does Not Exist!',
			statusCode: errorCode
		})
	}

	if (!bcrypt.compareSync(accOldPassword, accInfo[0].acc_password)) {
		return res.status(400).json({
			errorMessage: 'Password Incorrect!',
			statusCode: errorCode
		})
	}

	if (accNewPassword !== accConfirmPassword) {
		return res.status(400).json({
			errorMessage: 'password is different from confirm password',
			statusCode: errorCode
		})
	}

	let date_ob = new Date()

	const hashPassword = bcrypt.hashSync(accNewPassword, 3)
	const account = {
		acc_password: hashPassword,
		acc_updated_date: date_ob
	}

	await knex('tbl_account').where('acc_id', accId).update(account)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/delete/:id', accountValidation.paramsInfo, async (req, res) => {
	const { id } = req.params
	const { accRole } = req.account

	if (!roleModel.checkAdminRole(accRole)) {
		return res.status(400).json({
			errorMessage: 'permission access denied'
		})
	}

	const checkExist = await accountModel.findById(id)

	if (checkExist.length === 0) {
		return res.status(400).json({
			errorMessage: 'AccountID is invalid',
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

router.post('/update-role', accountValidation.updateRoleAccount, async (req, res) => {
	const { accId, accRole } = req.body
	const presentRole = req.account.accRole

	if (!roleModel.checkAdminRole(presentRole)) {
		return res.status(400).json({
			errorMessage: 'Permission Access Denied'
		})
	}

	const resultRole = await roleModel.findById(accRole)
	const resultAcc = await accountModel.findById(accId)

	if (resultRole.length === 0) {
		return res.status(400).json({
			errorMessage: `Invalid Role`,
			statusCode: errorCode
		})
	}

	if (resultAcc.length === 0) {
		return res.status(400).json({
			errorMessage: `Account Doesn't Exist`,
			statusCode: errorCode
		})
	}

	await knex('tbl_account').where('acc_id', accId).update('acc_role', accRole)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/update-status', accountValidation.updateStatusAccount, async (req, res) => {
	const { accId, accStatus } = req.body
	const presentRole = req.account.accRole

	if (!roleModel.checkAdminRole(presentRole)) {
		return res.status(400).json({
			statusCode: errorCode,
			errorMessage: `Permission Access Denied`
		})
	}

	if (accStatus !== 0 || accStatus !== 1 || accStatus !== 2) {
		return res.status(400).json({
			statusCode: errorCode,
			errorMessage: `Invalid Status`
		})
	}

	

	const resultAcc = await accountModel.findById(accId)

	if (resultAcc.length === 0) {
		return res.status(400).json({
			errorMessage: `Account Doesn't Exist`,
			statusCode: errorCode
		})
	}

	await knex('tbl_account').where('acc_id', accId).update('acc_status', accStatus)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/update-avatar', accountValidation.avatar, async (req, res) => {
	const { accId } = req.body

	var avatar = req.files

	const checkAvatar = avatar.image ? true : false

	const { accRole } = req.account
	let accIdFlag = accId

	if (!roleModel.checkAdminRole(accRole)) {
		accIdFlag = req.account.accId
	}

	const result = await accountModel.findById(accIdFlag)

	if (result.length === 0) {
		return res.status(400).json({
			errorMessage: 'AccountId Is Invalid'
		})
	}

	if (checkAvatar) {
		var validImage = imageValidator.validateValidAvatar(avatar)

		if (validImage !== '') {
			return res.status(400).json({
				errorMessage: validImage,
				statusCode: errorCode
			})
		}

		if (result[0].acc_avatar === null) {
			await imageService.avatarUploader(avatar.image, accIdFlag, 'insert')
		} else {
			let promiseToUploadImage = new Promise(async function (resolve) {
				await imageService.avatarUploader(avatar.image, accIdFlag, 'update', result[0].acc_avatar)
				resolve();
			})
			promiseToUploadImage.then(function () {
				imageService.deleteImage(result[0].acc_avatar)
			})
		}

		return res.status(200).json({
			statusCode: 0
		})
	} else {
		return res.status(400).json({
			errorMessage: 'Image File Is Require',
			statusCode: 0
		})
	}
})

router.post('/delete-avatar', accountValidation.avatar, async (req, res) => {
	const { accId } = req.body

	const { accRole } = req.account
	let accIdFlag = accId

	if (!roleModel.checkAdminRole(accRole)) {
		accIdFlag = req.account.accId
	}

	const result = await accountModel.findById(accIdFlag)

	if (result.length === 0) {
		return res.status(400).json({
			errorMessage: 'AccountId Is Invalid'
		})
	}

	const deleteImage = {
		acc_avatar: null
	}

	await knex('tbl_account').where({ acc_id: accIdFlag }).update(deleteImage)

	imageService.deleteImage(result[0].acc_avatar)

	return res.status(200).json({
		statusCode: 0
	})
})

module.exports = router
