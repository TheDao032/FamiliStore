const express = require('express')
const router = express.Router()
const knex = require('../utils/dbConnection')
const moment = require('moment');
const imageService = require('../services/imageService')
const imageValidator = require('../middlewares/validation/image.validate')
const validator = require('../middlewares/validation/product.validate')
const productModel = require('../models/product.model')

const successCode = 0
const errorCode = 1

router.post('/add', async (req, res) => {

	const { prodName, prodCategoryID, prodAmount, prodPrice, prodDescription, prodStatus } = req.body
	
	var images = req.files //need to get image from input type file, name is 'image'
	
	var errorMessage = "";
	//validate field
	if (prodName === undefined || prodCategoryID === undefined || prodAmount === undefined || prodPrice === undefined) {
		return res.status(400).json({
			errorMessage: 'Some required fields are undefined ',
			statusCode: errorCode
		})
	}

	if (prodName === '' || prodCategoryID === '' || prodAmount === '' || prodPrice === '') {
		return res.status(400).json({
			errorMessage: 'Some required fields are blank ',
			statusCode: errorCode
		})
	}
	
	if (prodName.length > 60) {
		return res.status(400).json({
			errorMessage: 'Product name accept only the length smaller or equal than 60',
			statusCode: errorCode
		})
	}
	
	if (prodDescription != undefined && prodDescription.length > 1000) {
		console.log('x')
		return res.status(400).json({
			errorMessage: 'Product description accept only the length smaller than 1000',
			statusCode: errorCode
		})
	}
	
	let regexPattern = /^\d+$/
	let resultInteger = regexPattern.test(prodPrice);

	if (!resultInteger) {
		return res.status(400).json({
			errorMessage: 'Product price must be integer !',
			statusCode: errorCode
		})
	}

	
	resultInteger = regexPattern.test(prodAmount);

	if (!resultInteger) {
		return res.status(400).json({
			errorMessage: 'Product amount must be integer !',
			statusCode: errorCode
		})
	}

	if (prodAmount > 10000 || prodAmount < 1) {
		return res.status(400).json({
			errorMessage: 'Ammount is not valid, must be smaller than 10000 and greater than 0!',
			statusCode: errorCode
		})
	}

	if (prodPrice > 1000000000 || prodPrice < 1000) {
		return res.status(400).json({
			errorMessage: 'Product price is not valid, must be smaller than 1000000000 or greater than 1000 !',
			statusCode: errorCode
		})
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
	if (images != null) {
		var errorFromValidateImage = imageValidator.validateValidImage(images)

		if (errorFromValidateImage !== '') {
			errorMessage = errorMessage + errorFromValidateImage
		}

		images = imageService.getImage(images)
	}

	if (errorMessage !== "") {
		return res.status(400).json({
			errorMessage: errorMessage,
			statusCode: errorCode
		})
	}

	await knex('tbl_product').insert({
		prod_name: prodName,
		prod_category_id: prodCategoryID,
		prod_amount: prodAmount,
		prod_price: prodPrice,
		prod_description: typeof prodDescription !== 'undefined' ? prodDescription : '',
		prod_created_date: moment().format('YYYY-MM-DD HH:mm:ss')
	})
		.returning('*')
		.then(async (rows) => {
			if (images != null) {
				if (images.length === undefined) {// number of uploaded image is 1
					await imageService.productUploader(images, rows[0].prod_id, 'insert')
				}
				else {
					for (let i = 0; i < images.length; i++) {
						await imageService.productUploader(images[i], rows[0].prod_id, 'insert')
					}
				}
			}
		})

	return res.status(200).json({
		statusCode: successCode
	})

})
router.post('/update/:id', validator.updateProduct, async (req, res) => {
	const { prodName, prodCategoryID, prodAmount, prodPrice, prodDescription } = req.body
	const { id } = req.params

	var errorMessage = ''
	if (prodCategoryID != undefined) {
		var cat = await knex('tbl_categories')
			.where('cate_id', prodCategoryID)

		if (cat.length === 0) {
			errorMessage = " Category doesn't exists!"
		}
	}

	var updateProduct = await knex('tbl_product')
		.where('prod_id', id)

	if (updateProduct.length === 0) {
		errorMessage = errorMessage + " Product record to update doesn't exist!"
	}

	if (prodName != undefined && prodCategoryID != undefined) {
		var prod = await knex('tbl_product')
			.where('prod_name', prodName)
			.andWhere('prod_category_id', prodCategoryID)
			.andWhere('prod_id', '!=', id)
		if (prod.length !== 0 && prodName != '') {
			errorMessage = errorMessage + " Product record with the same name and same category exist!"
		}
	}



	if (prodName != undefined && prodName == '') {
		errorMessage = errorMessage + " Name cannot be blank!"
	}

	if (errorMessage !== '') {
		return res.status(400).json({
			errorMessage: errorMessage,
			statusCode: errorCode
		})
	}


	if (prodName != undefined) {
		if (prodName.length > 60) {
			return res.status(400).json({
				errorMessage: 'Product name accept only the length smaller or equal than 60',
				statusCode: errorCode
			})
		}
	}

	if (prodDescription != undefined) {
		if (prodDescription.length > 1000) {
			return res.status(400).json({
				errorMessage: 'Product description accept only the length smaller than 1000',
				statusCode: errorCode
			})
		}
	}

	if (prodAmount != undefined) {
		if (prodAmount > 10000 || prodAmount < 1) {
			return res.status(400).json({
				errorMessage: 'Ammount cannot greater than 10000 or smaller than 1 !',
				statusCode: errorCode
			})
		}
	}

	if (prodPrice != undefined) {
		if (prodPrice > 1000000000 || prodPrice < 1000) {
			return res.status(400).json({
				errorMessage: 'Product price is not valid, cannot greater than 1000000000 or smaller than 1000 !',
				statusCode: errorCode
			})
		}
	}
	await knex('tbl_product')
		.where('prod_id', id)
		.update({
			prod_name: typeof prodName !== 'undefined' ? prodName : updateProduct[0].prod_name,
			prod_category_id: typeof prodCategoryID !== 'undefined' ? prodCategoryID : updateProduct[0].prod_category_id,
			prod_amount: typeof prodAmount !== 'undefined' ? prodAmount : updateProduct[0].prod_amount,
			prod_price: typeof prodPrice !== 'undefined' ? prodPrice : updateProduct[0].prod_price,
			prod_description: typeof prodDescription !== 'undefined' ? prodDescription : updateProduct[0].prod_description,
			prod_status: 1,
			prod_updated_date: moment().format('YYYY-MM-DD HH:mm:ss')
		})

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/update-image/:id', async (req, res) => {
	const { id } = req.params // product id
	const { imageName } = req.body //string of old images name
	var images = req.files //get file from req.files.image
	//validate id
	var result = await knex.from('tbl_product')
		.where('prod_id', id)

	if (result.length === 0) {
		return res.status(400).json({
			errorMessage: " Product record doesn't exist!",
			statusCode: errorCode
		})
	}

	//validate image type and length
	var errorFromValidateImage = imageValidator.validateValidImage(images)
	if (errorFromValidateImage !== '') {
		return res.status(400).json({
			errorMessage: errorFromValidateImage,
			statusCode: errorCode
		})
	}
	//validate length of old image & new image
	var numberOfNewImage = imageService.getImageLength(images)
	var imagesNameArray = imageName.split(",")
	var numberOfOldImage = imagesNameArray[0] == '' ? 0 : imagesNameArray.length
	
	var prodImgNumber = await knex.raw(`select count(prod_img_product_id) from tbl_product_images where prod_img_product_id = ${id}`)
	prodImgNumber = prodImgNumber.rows[0].count
	/* DEBUG LOG
	console.log('---------------------------------------------')
	console.log('image array ' + (imagesNameArray[0] == ''))
	console.log('current image: ' +  prodImgNumber)
	console.log('new image: ' + numberOfNewImage)
	console.log('old image: ' + numberOfOldImage)
	*/
	if (prodImgNumber - numberOfOldImage + numberOfNewImage > 5) {
		return res.status(400).json({
			errorMessage: "Number of image to update and number of image to delete is not valid, note that one product can have only 5 images",
			statusCode: errorCode
		})
	}
	//delete old image
	if (numberOfOldImage > 0) {
		var imageLink = await knex.raw(`select prod_img_data from tbl_product_images where prod_img_product_id = ${id}`)
		imageLink = imageLink.rows
		//console.log(imageLink.rows[0].prod_img_data)
		for (let i = 0; i < numberOfOldImage; i++) {
			for (let j = 0; j < imageLink.length; j++) {
				if (imagesNameArray[i] == imageLink[j].prod_img_data) {
					await knex.raw(`delete from tbl_product_images where prod_img_data = '${imageLink[j].prod_img_data}'`)
					imageService.deleteImage(imageLink[j].prod_img_data);
				}
			}
		}
	}

	//add new image
	if (numberOfNewImage > 0) {
		images = imageService.getImage(images)

		if (images != null) {
			if (images.length === undefined) {// number of uploaded image is 1
				await imageService.productUploader(images, id, 'insert')
			}
			else {
				for (let i = 0; i < images.length; i++) {
					await imageService.productUploader(images[i], id, 'insert')
				}
			}
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
			errorMessage: errorMessage,
			statusCode: 1
		})
	}
	//call function
	productModel.deleteProduct(id)

	return res.status(200).json({
		statusCode: successCode
	})
})

module.exports = router