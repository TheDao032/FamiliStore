const moment = require('moment')
const environment = require('../environments/environment')
const knex = require('../utils/dbConnection')
const bcrypt = require('bcrypt');

const errorCode = 1
const successCode = 0

const getRole = async (acc_id) => {
	const accRole = await knex('tbl_account').where({ acc_id: acc_id }).select('acc_role')

	if (accRole.lenght !== 0) {
		return accRole[0].acc_role
	} else {
		throw new Error('acc_id does not exist')
	}
}

const authenticate = (username, password, callback) => {
	knex('tbl_account').where({ acc_username: username}).select('*')
		.then((result) => {
			if (result.lenght === 0) {
				throw new Error('User Not Found')
			}
			if(!bcrypt.compareSync(password, result[0]['acc_password'])){
				throw new Error('User password wrong')
			}

			const { acc_id, acc_full_name } = result[0]
			const auth = {
				username,
				acc_id,
			}
			console.log(auth)
			return Promise.all([
				auth, 
				getRole(acc_id).then((role_id) => {
					return {
						role_id,
						acc_full_name,
						acc_id
					}
				})
			])
		})
		.then(([auth, info]) => {
			console.log('auth', auth)
			console.log('info', info)
			const user = {
				...info
			}
			callback(null, auth, user)
		})
		.catch((err) => {
			throw new Error(err.toString())
		})
}

module.exports = {
	getRole,
	authenticate
}
