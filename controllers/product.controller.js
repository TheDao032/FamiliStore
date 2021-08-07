const express = require('express')
const router = express.Router()
const knex = require('../utils/dbConnection')
const moment = require('moment');
const commonService = require('../services/commonService')
const successCode = 0
const errorCode = 1

router.get('/list', async (req, res) => {

	var result = await knex.from('tbl_product')
		.join('tbl_product_images', 'tbl_product.prod_id', '=', 'tbl_product_images.prod_img_product_id')

	//process return list
	var prodList = []

	var index = 0
	while (index < result.length) {
		let prodObj = {
			prod_id: result[index].prod_id,
			prod_name: result[index].prod_name,
			prod_category_id: result[index].prod_category_id,
			prod_amount: result[index].prod_amount,
			prod_created_date: result[index].prod_created_date,
			prod_updated_date: result[index].prod_updated_date,
			prod_price: result[index].prod_price
		}
		let imageLink = []
		for (let i = index; i < result.length; i++) {
			index = i + 1
			imageLink.push(result[i].prod_img_data)
			
			if ((i >= result.length - 1) || ( i != 0 && result[index].prod_id != result[index - 1].prod_id )) {
				break;
			}
		}
		prodObj['images'] = imageLink
		prodList.push(prodObj)
	}

	if (result) {
		return res.status(200).json({
			listProduct: prodList,
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


router.get('/list-best-sale', async (req, res) => {
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




router.get('/list-suggestion', async (req, res) => {
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

	var cat = await knex('tbl_categories').where('cate_id', catID)
	if (cat.length == 0) {
		return res.status(400).json({
			message: "Category is not valid"
		})
	}

	var result = await knex.from('tbl_product')
		.join('tbl_product_images', 'tbl_product.prod_id', '=', 'tbl_product_images.prod_img_product_id')
		.where('prod_category_id', catID)

	//process return list
	var prodList = []

	var index = 0
	while (index < result.length) {
		let prodObj = {
			prod_id: result[index].prod_id,
			prod_name: result[index].prod_name,
			prod_category_id: result[index].prod_category_id,
			prod_amount: result[index].prod_amount,
			prod_created_date: result[index].prod_created_date,
			prod_updated_date: result[index].prod_updated_date,
			prod_price: result[index].prod_price
		}
		let imageLink = []
		for (let i = index; i < result.length; i++) {
			index = i + 1
			imageLink.push(result[i].prod_img_data)
			
			if ((i >= result.length - 1) || ( i != 0 && result[index].prod_id != result[index - 1].prod_id )) {
				break;
			}
		}
		prodObj['images'] = imageLink
		prodList.push(prodObj)
	}

	if (result) {
		return res.status(200).json({
			listProduct: prodList,
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

	var prod = await knex('tbl_product')
		.where('prod_id', id)

	if (prod.length === 0) {
		var errorMessage = " Product record doesn't exist!"

		return res.status(400).json({
			message: errorMessage,
			statusCode: 1
		})
	}

	var prodObject = {}
	const prodResult = await knex.from('tbl_product')
		.where('prod_id', id)
		.returning('*')
		.then(async (rows) => {
			prodObject = rows[0];
			var imageResult = await knex.from('tbl_product_images')
				.where('prod_img_product_id', prodObject.prod_id);
			prodObject['prod_img'] = imageResult.map(attr => attr.prod_img_data);
			console.log(prodObject)
		})
	if (prodObject) {
		return res.status(200).json({
			//listProductDetail: result,
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
	var images = req.files //need to get image from input type file, name is 'image'

	var errorMessage = "";

	//validate field
	if (prodName == '' || prodCategoryID == '' || prodAmount == '' || prodPrice == '') {
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
	var errorFromValidateImage = commonService.validateValidImage(images)

	if (errorFromValidateImage !== '') {
		errorMessage = errorMessage + errorFromValidateImage
	}

	if (errorMessage !== "") {
		return res.status(400).json({
			message: errorMessage,
			statusCode: errorCode
		})
	}

	images = commonService.getImage(images)

	await knex('tbl_product').insert({
		prod_name: prodName,
		prod_category_id: prodCategoryID,
		prod_amount: prodAmount,
		prod_price: prodPrice,
		prod_status: 1,
		prod_created_date: moment().format('YYYY-MM-DD HH:mm:ss')
	})
		.returning('*')
		.then(async (rows) => {

			if (images.length == undefined) {// number of uploaded image is 1
				await commonService.ImageUploader(images, rows[0].prod_id, 'insert')
			}
			else {
				for (let i = 0; i < images.length; i++) {
					await commonService.ImageUploader(images[i], rows[0].prod_id, 'insert')
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
	const { prodName, prodCategoryID, prodAmount, prodPrice } = req.body
	const { id } = req.params

	var errorMessage = ''
	var prod = await knex('tbl_product')
		.where('prod_name', prodName)
		.andWhere('prod_category_id', prodCategoryID)

	var cat = await knex('tbl_categories')
		.where('cate_id', prodCategoryID)

	if (cat.length === 0) {
		errorMessage = " Category doesn't exists!"
	}

	if (prod.length !== 0) {
		errorMessage = errorMessage + " Product record with the same name exists!"
	}

	if (errorMessage !== '') {
		return res.status(400).json({
			message: errorMessage,
			code: errorCode
		})
	}

	await knex('tbl_product')
		.where('prod_id', id)
		.update({
			prod_name: typeof prodName !== 'undefined' ? prodName : prod.prod_name,
			prod_category_id: typeof prodCategoryID !== 'undefined' ? prodCategoryID : prod.prod_category_id,
			prod_amount: typeof prodAmount !== 'undefined' ? prodAmount : prod.prod_amount,
			prod_price: typeof prodPrice !== 'undefined' ? prodPrice : prod.prod_price,
			prod_status: 1,
			prod_updated_date: moment().format('YYYY-MM-DD HH:mm:ss')
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

router.post('/update-image/:id', async (req, res) => {
	const { id } = req.params // product id

	const { imageName } = req.body //string of old images name

	var images = req.files //get file from req.files.image

	var imagesNameArray = imageName.split(",")

	var errorMessage = ''

	var result = await knex.from('tbl_product')
		.where('prod_id', id)

	if (result.length === 0) {
		errorMessage = errorMessage + " Product record doesn't exist!"
	}

	//validate image
	var errorFromValidateImage = commonService.validateValidImage(images)

	if (errorFromValidateImage !== '') {
		errorMessage = errorMessage + errorFromValidateImage
	}
	//validate old image & new image length
	var newImageLength = commonService.getImageLength(images.image)
	var oldimageLength = imagesNameArray.length

	if (newImageLength !== oldimageLength) {
		errorMessage = errorMessage + " Old image links and new uploaded image doesn't have the consistency about length!"
	}

	if (errorMessage !== '') {
		return res.status(400).json({
			message: errorMessage,
			code: errorCode
		})
	}

	images = commonService.getImage(images)

	//uploadd image

	if (images.length == undefined) {// number of uploaded image is 1
		let promiseToUploadImage = new Promise(async function (resolve) {
			await commonService.ImageUploader(images, id, 'update', imagesNameArray[0])
			resolve();
		})
		promiseToUploadImage.then(function () {
			commonService.deleteImage(imagesNameArray[0])
		})

	}
	else {
		for (let i = 0; i < newImageLength; i++) {
			//upload new image and delete old image on cloud
			let promiseToUploadImage = new Promise(async function (resolve) {
				await commonService.ImageUploader(images[i], id, 'update', imagesNameArray[i])
				resolve();
			})
			promiseToUploadImage.then(function () {
				commonService.deleteImage(imagesNameArray[i])
			})

		}
	}

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
			message: errorMessage,
			statusCode: 1
		})
	}


	//delete image of product
	await knex('tbl_product_images').where('prod_img_product_id', id).del()
		.returning('*')
		.then((deleted) => {
			for (let i = 0; i < deleted.length; i++) {
				commonService.deleteImage(deleted[i].prod_img_data);
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
