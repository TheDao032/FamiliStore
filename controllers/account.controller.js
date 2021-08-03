const express = require('express') 

const router = express.Router()
const knex = require('../utils/dbConnection')
const validation = require('../middlewares/validation')
// const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')

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
	const result = await knex.from('tbl_account').where('acc_id', id)

	if (result) {
		return res.status(200).json({
			account: result,
			statusCode: successCode
		})
	}

	return res.status(500).json({ 
		account: [],
		statusCode: errorCode
	})
})

router.patch('/update', validation.updateAccount, async (req, res) =>{
	const { picture } = req.files
	const checkAvatar = picture ? true : false
	const { accId, accUserName, accPassWord, accEmail, accPhoneNumber, accFullName, accRole } = req.body
	let date_ob = new Date()

	const verifying = await knex('tbl_account')
						.where('acc_username', userName)
						.whereNot('acc_id', accId)
						.orWhere('acc_email', accEmail)
						.whereNot('acc_id', accId)

	if(verifying.length != 0){
		return res.status(400).json({
			errorMessage: 'username or email exist',
			code: errorCode
		})
	}

	const result = await knex('tbl_account').where('acc_id', accId);
	const hashPassword = bcrypt.hashSync(accPassWord, 3);
	const account = {
		acc_username: checkUserName ? accUserName : result.acc_username,
		acc_password: checkPassWord ? hashPassword : result.acc_password,
		acc_email: checkEmail ? accEmail : result.acc_email,
		acc_phone_number: checkPhoneNumber ? accPhoneNumber : result.acc_phone_number,
		acc_full_name: checkFullName ? accFullName : result.acc_full_name,
		acc_role: checkRole ? accRole : result.acc_role,
		acc_avatar: checkAvatar ? picture.data : result.acc_avatar,
		acc_updated_date: date_ob
	};
	await knex('tbl_account').where('acc_id', accId).update(account)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/delete/:id',async (req, res) => {
	const { id } = req.params
	await knex('tbl_account').where('acc_id', id).update({ acc_status: 1 })

	return res.status(200).json({
		statusCode: successCode
	})
})

// đặt tài khoản làm nhân viên, xóa vai trò nhân viên
router.post('/update-role', validation.updateRoleAccount, async (req, res) => {
	const { accId, accRole } = req.body
	const resultRole = await knex.from('tbl_roles').where('rol_id', accRole)
	const resultAcc = await knex.from('tbl_account').where('acc_id', accId)
	if(resultRole.length === 0){
		return res.status(400).json({
			errorMessage: 'role not exists',
			code: errorCode
		})
	}
	if(resultAcc.length === 0){
		return res.status(400).json({
			errorMessage: 'account not exists',
			code: errorCode
		})
	}
	await knex('tbl_account').where('acc_id', accId).update('acc_role', accRole)

	return res.status(200).json({
		statusCode: successCode
	})
})
module.exports = router
