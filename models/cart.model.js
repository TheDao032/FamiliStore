const knex = require('../utils/dbConnection')

const findByAccAndProduct = async (accId, prodId) => {
	const info = await knex('tbl_cart')
					.where({ cart_acc_id: accId, cart_prod_id })

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
	await knex('tbl_cart')
			.update(cartObject)
			.where({ cart_id: cartId })
}


const addcart = async (cartObject) => {
	await knex('tbl_cart')
			.insert(cartObject)
}

module.exports = {
	findByAccAndProduct,
	findByAcc,
	updateCart,
	addcart,
	findById
}
