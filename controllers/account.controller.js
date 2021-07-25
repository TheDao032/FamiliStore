const express = require('express')
const router = express.Router()
const knex = require('../utils/dbConnection')
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const successCode = 0
const errorCode = 1

router.get('/list', async (req, res) => {
	const result = await knex.from('tbl_account')

	if (result) {
		return res.status(200).json({
			listActors: result,
			statusCode: successCode
		})
	}

	return res.status(500).json({
		listActors: [],
		statusCode: errorCode
	})
})

router.get('/details/:id', async (req, res) => {
	const { id } = req.params
	const result = await knex.from('account').where('account_id', id)

	if (result) {
		return res.status(200).json({
			listActors: result,
			statusCode: successCode
		})
	}

	return res.status(500).json({ listActors: [],
		statusCode: errorCode
	})
})

router.post('/add', async (req, res) => {
	const acc = req.body;
	let date_ob = new Date();
	if(!acc.username || !acc.password || !acc.email){
		return res.status(400).json({
			errorMessage: 'add faill',
			code: errorCode
		})
	}

	const verifying = await knex('tbl_account').where('acc_username', acc.username).orWhere('acc_email', acc.email).select('acc_id');
	if(verifying.length != 0){
		return res.status(400).json({
			errorMessage: 'username or email exist',
			code: errorCode
		})
	}
	// add account
	const hashPassword = bcrypt.hashSync(acc.password, 3);
	const result = await knex('tbl_account').max('acc_id as maxId').first()
	const account = {
		acc_id: +result['maxId'] + 1,
		acc_username: acc.username,
		acc_password: hashPassword,
		acc_email: acc.email,
		acc_phone_number: acc.phone_number || null,
		acc_full_name: acc.full_name || null,
		acc_role: acc.role || 1,
		acc_token: null,
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
})
router.patch('/update', async (req, res) =>{
	const acc = req.body;
	let date_ob = new Date();
	if(!acc.username || !acc.password || !acc.email || !acc.id){
		return res.status(400).json({
			errorMessage: 'update faill',
			code: errorCode
		});
	}
	const verifying = await knex('tbl_account').where('acc_username', acc.username).whereNot('acc_id', acc.id).orWhere('acc_email', acc.email).whereNot('acc_id', acc.id).select('acc_id');
	if(verifying.length != 0){
		return res.status(400).json({
			errorMessage: 'username or email exist',
			code: errorCode
		})
	}
	const acc_id = acc.id;
	const result = await knex('tbl_account').where('acc_id', acc_id);
	const hashPassword = bcrypt.hashSync(acc.password, 3);
	const account = {
		acc_username: acc.username || result['acc_username'],
		acc_password: hashPassword || result['acc_password'],
		acc_email: acc.email || result['acc_email'],
		acc_phone_number: acc.phone_number || result['acc_phone_number'],
		acc_full_name: acc.full_name || result['acc_full_name'],
		acc_role: acc.role || result['acc_role'],
		acc_avatar: acc.avatar || result['acc_avatar'],
		acc_status: acc.status || result['acc_status'],
		acc_created_date: result['acc_created_date'],
		acc_updated_date: date_ob
	};
	await knex('tbl_account').where('acc_id', acc_id).update(account).catch((error) => {
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
	knex('account').where('account_id', id).del().catch((error) => {
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
