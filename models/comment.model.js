const knex = require('../utils/dbConnection')

const findAll = async () => {
	const info = await knex('tbl_comment')

	return info
}

module.exports = {
	findAll
}
