const knex = require('../utils/dbConnection')

const findAll = async () => {
	const info = await knex('tbl_bill')

	return info
}

const findByAccId = async (accId) => {
	const info = await knex('tbl_bill').where({ bill_account_id: accId })

	return info
}

module.exports = {
	findAll,
	findByAccId
}
