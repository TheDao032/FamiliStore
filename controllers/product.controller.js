const express = require('express')
const router = express.Router()
const knex = require('../utils/dbConnection')
const moment = require('moment');
const commonService = require('../services/commonService')
const successCode = 0
const errorCode = 1



router.get('/list-best-sale-per-week', async (req, res) => {
	const { catID } = req.params

	var cat = await knex('tbl_categories').where('cate_id', catID)
	if (cat.length == 0) {
		return res.status(400).json({
			message: "Category is not valid"
		})
	}


	var result = await knex.from('tbl_product')
		.where('prod_category_id', catID)
	if (result) {
		return res.status(200).json({
			listProduct: result,
			statusCode: successCode
		})
	}
	else {
		return res.status(500).json({
			listProduct: [],
			statusCode: errorCode
		})
	}

})

router.get('/list-best-sale-per-month', async (req, res) => {
	const { catID } = req.params

	var cat = await knex('tbl_categories').where('cate_id', catID)
	if (cat.length == 0) {
		return res.status(400).json({
			message: "Category is not valid"
		})
	}


	var result = await knex.from('tbl_product')
		.where('prod_category_id', catID)
	if (result) {
		return res.status(200).json({
			listProduct: result,
			statusCode: successCode
		})
	}
	else {
		return res.status(500).json({
			listProduct: [],
			statusCode: errorCode
		})
	}

})

router.get('/list-best-price', async (req, res) => {
	const { catID } = req.params

	var cat = await knex('tbl_categories').where('cate_id', catID)
	if (cat.length == 0) {
		return res.status(400).json({
			message: "Category is not valid"
		})
	}


	var result = await knex.from('tbl_product')
		.where('prod_category_id', catID)
	if (result) {
		return res.status(200).json({
			listProduct: result,
			statusCode: successCode
		})
	}
	else {
		return res.status(500).json({
			listProduct: [],
			statusCode: errorCode
		})
	}

})

router.get('/list-by-cat/:catID', async (req, res) => {
	const { catID } = req.params
	console.log(catID)
	var cat = await knex('tbl_categories').where('cate_id', catID)
	if (cat.length == 0) {
		return res.status(400).json({
			message: "Category is not valid"
		})
	}


	var result = await knex.from('tbl_product')
		.where('prod_category_id', catID)
	if (result) {
		return res.status(200).json({
			listProduct: result,
			statusCode: successCode
		})
	}
	else {
		return res.status(500).json({
			listProduct: [],
			statusCode: errorCode
		})
	}

})


router.get('/list-suggest', async (req, res) => {
	const { catID } = req.params

	var cat = await knex('tbl_categories').where('cate_id', catID)
	if (cat.length == 0) {
		return res.status(400).json({
			message: "Category is not valid"
		})
	}


	var result = await knex.from('tbl_product')
		.where('prod_category_id', catID)
	if (result) {
		return res.status(200).json({
			listProduct: result,
			statusCode: successCode
		})
	}
	else {
		return res.status(500).json({
			listProduct: [],
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
			listProductDetail: result,
			statusCode: successCode
		})
	}

	return res.status(500).json({
		listProductDetail: [],
		statusCode: errorCode
	})
})

router.post('/add', async (req, res) => {

	const { prodName, prodCategoryID, prodAmount, prodPrice, prodStatus } = req.body
	console.log(req.body);
	var errorMessage = "";
	//validate field
	if (prodName == '' || prodCategoryID == '' || prodAmount == '' || prodPrice == '' || prodStatus == '') {
		//catch error
		errorMessage = errorMessage + ' Some fields are blank!'
	}
	var prod = await knex('tbl_product')
		.where('prod_name', prodName)
		.andWhere('prod_category_id', prodCategoryID)

	if (prod.length !== 0) {
		errorMessage = errorMessage + " Product record exists!"
	}

	var cat = await knex('tbl_categories')
		.where('cate_id', prodCategoryID)

	if (cat.length === 0) {
		errorMessage = errorMessage + " Wrong category!"
	}
	//validate image
	const images = req.files.image

	var isValidImage = commonService.validateImage(images)
	var isValidNumberOfFile = commonService.validateNumberOfFiles(images)

	if (!isValidImage)
		errorMessage = errorMessage + "Invalid image!"
	if (!isValidNumberOfFile)
		errorMessage = errorMessage + " Invalid number of files!"

	if (errorMessage !== "") {
		return res.status(400).json({
			message: errorMessage,
			statusCode: errorCode
		})
	}

	await knex('tbl_product').insert({
		prod_name: prodName,
		prod_category_id: prodCategoryID,
		prod_amount: prodAmount,
		prod_price: prodPrice,
		prod_status: prodStatus,
		prod_created_date: moment().format('YYYY-MM-DD HH:mm:ss')
	})
		.returning('*')
		.then(async (rows) => {

			if (images.length == undefined) {// number of uploaded image is 1
				await commonService.ImageUploader(images, rows[0].prod_id)
			}
			else {
				for (let i = 0; i < images.length; i++) {
					await commonService.ImageUploader(images[i], rows[0].prod_id)
				}
			}
		})
		.catch((err) => {
			return res.status(500).json({
				errorMessage: 'There is an error from database while inserting new product record!',
				statusCode: errorCode
			})

		})

	return res.status(200).json({
		statusCode: successCode
	})

})
router.post('/update/:id', async (req, res) => {
	const { prodName, prodCategoryID, prodAmount, prodPrice, prodStatus, prodImgData, prodImgStatus } = req.body

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
			return res.status(500).json({
				errorMessage: error,
				statusCode: errorCode
			})

		})

	return res.status(200).json({
		statusCode: successCode
	})
})
router.post('/delete/:id', async (req, res) => {
	const { id } = req.params
	var prod = await knex('tbl_product')
		.where('prod_id', id)
		
	if (prod.length === 0) {
		var errorMessage = " Product record doesn't exist!"

		return res.status(400).json({
			message:errorMessage,
			statusCode: 1
		})
	}

	
	//delete image of product
	await knex('tbl_product_images').where('prod_img_product_id', id).del()
		.returning('*')
		.then((deleted) => {
			for (let i = 0; i < deleted.length; i++) {
				var link = deleted[i].prod_img_data.split('/')
				link = link[link.length - 1].split(".")
				link = link[0]
				commonService.deleteImage(link);
			}

		})
	
	//delete product
	
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
