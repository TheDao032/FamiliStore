const knex = require('../utils/dbConnection')

const findByAccAndProduct = async (accId, prodId) => {
	const info = await knex('tbl_cart')
					.where({ cart_acc_id: accId, cart_prod_id: prodId })

    return info
}

const findByAcc = async (accId) => {
	const info = await knex('tbl_cart')
					.where({ cart_acc_id: accId })

    return info
}

const findById = async (cartId) => {
	const info = await knex('tbl_cart')
					.where({ cart_id: cartId })

    return info
}

const updateCart = async (cartId, cartObject) => {
	const returnInfo = await knex('tbl_cart')
			.update(cartObject)
			.where({ cart_id: cartId }).returning('cart_id')

	return returnInfo[0]
}


const addcart = async (cartObject) => {
	const returnInfo = await knex('tbl_cart')
			.insert(cartObject).returning('cart_id')

	return returnInfo[0]
}

module.exports = {
	findByAccAndProduct,
	findByAcc,
	updateCart,
	addcart,
	findById
}
