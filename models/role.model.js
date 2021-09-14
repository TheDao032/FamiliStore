const knex = require('../utils/dbConnection')

const findById = async (roleId) => {
	return await knex('tbl_roles')
					.where({ rol_id: roleId })
}

const checkAdminRole = (roleId) => {
	if (roleId === 'ADM') {
		return true
	}
	return false
}

module.exports = {
	findById,
	checkAdminRole
}
