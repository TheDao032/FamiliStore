const knex = require('../utils/dbConnection')
const imageService = require('../services/imageService')
const imageValidator = require('../middlewares/validation/image.validate')
const deleteProduct = async function (id) {
    //delete comment
	await Promise.all([
		knex('tbl_comment').where('cmt_product_id', id).del(),
		//delete image of product
		knex('tbl_product_images').where('prod_img_product_id', id).del()
			.returning('*')
			.then((deleted) => {
				for (let i = 0; i < deleted.length; i++) {
					imageService.deleteImage(deleted[i].prod_img_data);
				}
	
			}),
	
		//delete product
		knex('tbl_product').where('prod_id', id).del()
	])
	
	return true
}

const findById = async (prodId) => {
	const info = await knex('tbl_product').where({ prod_id: prodId })

	return info
}

const findByCateId = async (cateId) => {
	const info = await knex('tbl_product').where({ prod_category_id: cateId })

	return info
}

module.exports = {
    deleteProduct,
	findById,
	findByCateId
}