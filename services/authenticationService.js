const moment = require('moment')
const environment = require('../environments/environment')
const knex = require('../utils/dbConnection')
const bcrypt = require('bcrypt')
const accountModel = require('../models/account.model')

const errorCode = 1
const successCode = 0

const getRole = async (acc_id) => {
	const accRole = await knex('tbl_account').where({ acc_id: acc_id }).select('acc_role')

	if (accRole.length !== 0) {
		return accRole[0].acc_role
	} else {
		return ''
	}
}


const authenticate = async (email, password, callback, req, res) => {
	const result = await accountModel.findActiveUser(email)

	if (result.length === 0) {
		return res.status(500).json({ 
			errorMessage: 'User Does Not Exist!',
			statusCode: errorCode
		})
	}

	if (!bcrypt.compareSync(password, result[0].acc_password)) {
		return res.status(500).json({ 
			errorMessage: 'Password Incorrect!',
			statusCode: errorCode
		})
	}

	const { acc_id, acc_status } = result[0]
	const auth = {
		accStaus: acc_status,
		accId: acc_id,
	}
	const info = await Promise.all([
		auth, 
		getRole(acc_id).then((role) => {
			return {
				role,
				accStatus: acc_status,
				accId: acc_id
			}
		})
	])
	const user = {
		...info[1]
	}
	callback(null, auth, user)
}

module.exports = {
	getRole,
	authenticate
}
