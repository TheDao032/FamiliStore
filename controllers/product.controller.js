const express = require('express')
const router = express.Router()
const knex = require('../utils/dbConnection')
const moment = require('moment');
const successCode = 0
const errorCode = 1

router.get('/list', async (req, res) => {
	var p = +req.query.p;
	var cat = req.query.cat || "%";
	var order = req.query.order || 'asc';
	var limit = req.query.limit || 10;
	var result = await knex.from('tbl_product')
		.join('tbl_categories', 'tbl_product.prod_category_id', '=', 'tbl_categories.cate_id')
		.join('tbl_product_images', 'tbl_product.prod_id', '=', 'tbl_product_images.prod_img_product_id')
		.where('tbl_categories.cate_name', 'like', cat)
		.limit(limit)
		.offset(p * limit)
		.orderBy('prod_name', order)

	if (result) {
		return res.status(200).json({
			list: result,
			statusCode: successCode
		})
	}
	else {
		return res.status(500).json({
			list: [],
			statusCode: errorCode
		})
	}

})

router.get('/details/:id', async (req, res) => {
	const { id } = req.params
	const result = await knex.from('tbl_product')
		.join('tbl_categories', 'tbl_product.prod_category_id', '=', 'tbl_categories.cate_id')
		.join('tbl_product_images', 'tbl_product.prod_id', '=', 'tbl_product_images.prod_img_product_id')
		.where('prod_id', id)

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

router.post('/add', async (req, res) => {
	var {prodID, prodName, prodCategoryID, prodAmount, prodPrice, prodStatus, prodImgData, prodImgStatus} = req.body

	var prod = await knex('tbl_product')
		.where('prod_name', prodName)
		.andWhere('prod_category_id', prodCategoryID)
	if (prod.length !== 0) {
		return res.status(400).json({
			errorMessage: 'product record exists',
			code: errorCode
		})
	}
	const imgNextID = await knex('tbl_product_images').max('prod_img_id as MaxID').first()
	await knex('tbl_product').insert({
		prod_id: prodID,
		prod_name: prodName,
		prod_category_id: prodCategoryID,
		prod_amount: prodAmount,
		prod_price: prodPrice,
		prod_status: prodStatus,
		prod_created_date: moment().format('YYYY-MM-DD HH:mm:ss')
	})
		.returning('*')
		.then(async (rows) => {
			await knex('tbl_product_images').insert({
				prod_img_id: imgNextID.MaxID + 1,
				prod_img_product_id: rows[0].prod_id,
				prod_img_data: prodImgData,
				prod_img_status: prodImgStatus
			})
		})
		.catch((error) => {
			return res.status(500).json({
				errorMessage: error,
				statusCode: errorCode
			})
		})




	return res.status(200).json({
		statusCode: successCode
	})
})
router.post('/update/:id', async (req, res) => {
	var {prodName, prodCategoryID, prodAmount, prodPrice, prodStatus, prodImgData, prodImgStatus} = req.body

	var prod = await knex('tbl_product')
		.where('prod_name', prodName)
		.andWhere('prod_category_id', prodCategoryID)

	if (prod.length !== 0) {
		return res.status(400).json({
			errorMessage: 'invalid update action',
			code: errorCode
		})
	}

	const { id } = req.params
	await knex('tbl_product')
		.where('prod_id', id)
		.update({
			prod_name: prodName,
			prod_category_id: prodCategoryID,
			prod_amount: prodAmount,
			prod_price: prodPrice,
			prod_status: prodStatus,
			prod_updated_date: moment().format('YYYY-MM-DD HH:mm:ss')
		})
		.then(async (rows) => {
			if (!rows) {

				return res.status(404).json({ success: false });
			}

			await knex('tbl_product_images')
				.where('prod_img_product_id', id)
				.update({
					prod_img_data: prodImgData,
					prod_img_status: prodImgStatus
				})

		})
		.catch((err) => {
			throw new Error(err.toString())

		})

	return res.status(200).json({
		statusCode: successCode
	})
})
router.post('/delete/:id', async (req, res) => {
	const { id } = req.params;
	await knex('tbl_product_images').where('prod_img_product_id', id).del().catch((error) => {
		return res.status(500).json({
			errorMessage: error,
			statusCode: errorCode
		})
	})
	await knex('tbl_product').where('prod_id', id).del().catch((error) => {
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
