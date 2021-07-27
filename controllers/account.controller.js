const express = require('express') 

const router = express.Router()
const knex = require('../utils/dbConnection')
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
	const result = await knex.from('tbl_account').where('account_id', id)

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

router.patch('/update', async (req, res) =>{
	const { picture } = req.files
	const checkAvatar = picture ? true : false
	const { accId, accUserName, accPassWord, accEmail, accPhoneNumber, accFullName, accRole } = req.body
	const checkAccId = accId && accId !== ''
	const checkUserName = accUserName && accUserName !== ''
	const checkPassWord = accPassWord && accPassWord !== ''
	const checkEmail = accEmail && accEmail !== ''
	const checkPhoneNumber = accPhoneNumber && accPhoneNumber !== ''
	const checkFullName = accFullName && accFullName !== ''
	const checkRole = accRole && accRole !== ''
	let date_ob = new Date()

	if(!checkAccId || !checkUserName || !checkPassWord || !checkEmail){
		return res.status(400).json({
			errorMessage: 'update faill',
			code: errorCode
		});
	}

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
	await knex('tbl_account').where('acc_id', accId).update(account).catch((error) => {
		return res.status(500).json({
			errorMessage: error,
			statusCode: errorCode
		})
	});
	return res.status(200).json({
		statusCode: successCode
	});
})

router.post('/delete/:id', (req, res) => {
	const { id } = req.params
	knex('tbl_account').where('account_id', id).update({ acc_status: 1 }).catch((error) => {
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
