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
	const imgNextID = await knex('tbl_product_images').max('prod_img_id as MaxID').first()
	await knex('tbl_product').insert({
		prod_id: req.body.prod_id,
		prod_name:req.body.prod_name,
		prod_category_id: req.body.prod_category_id,
		prod_amount : req.body.prod_amount,
		prod_price : req.body.prod_price,
		prod_status: req.body.prod_status,
		prod_created_date : moment().format('YYYY-MM-DD HH:mm:ss')
	})
	.returning('*')
	.then(async (rows) =>{
		await knex('tbl_product_images').insert({
			prod_img_id:imgNextID.MaxID + 1,
			prod_img_product_id: rows[0].prod_id,
			prod_img_data : req.body.prod_img_data,
			prod_img_status:req.body.prod_img_status
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
router.post('/update/:id', async (req,res) => {
	const {id} = req.params
	await knex('tbl_product')
	.where('prod_id', id)
	.update({
		prod_name:req.body.prod_name,
		prod_category_id: req.body.prod_category_id,
		prod_amount : req.body.prod_amount,
		prod_price : req.body.prod_price,
		prod_status: req.body.prod_status,
		prod_updated_date : moment().format('YYYY-MM-DD HH:mm:ss')
	})
	.then(async (rows) =>{
		if(!rows){
			
			return res.status(404).json({success:false});
		}
		
		await knex('tbl_product_images')
		.where('prod_img_product_id', id)
		.update({
			prod_img_data : req.body.prod_img_data,
			prod_img_status:req.body.prod_img_status
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
