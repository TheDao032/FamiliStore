const express = require('express')
const router = express.Router()
const knex = require('../utils/dbConnection')
const moment = require('moment');
const imageService = require('../services/imageService')
const imageValidator = require('../middlewares/validation/image.validate')
const commonService = require('../services/commonService')
const validator = require('../middlewares/validation/product.validate')
const productModel = require('../models/product.model')
const successCode = 0
const errorCode = 1

router.post('/list', validator.listProduct, async (req, res) => {
	const { page, limit } = req.body
	const offset = limit * (page - 1)
	

	if (page < 1 || limit < 1 || limit > 10) {
		return res.status(400).json({
			errorMessage: "limit and page parameter is not valid",
			statusCode: errorCode
		})
	}
	
	var numberPage = await knex.raw(`select count(distinct tbl_product.prod_id) 
	from tbl_product`)


	numberPage = Number(numberPage.rows[0].count)
	if (numberPage > limit) {
		numberPage = Math.ceil(numberPage / limit)
	}
	else {
		numberPage = 1
	}

	var result = await knex.raw(`with product as(
		select * from tbl_product join tbl_categories on tbl_categories.cate_id = tbl_product.prod_category_id
		order by prod_id desc
		offset ${offset}
		limit ${limit}
	)
	select pr.*, img.prod_img_data from product pr left join tbl_product_images img
	on img.prod_img_product_id = pr.prod_id
	order by prod_id desc`)
	result = result.rows


	var prodList = []

	var index = 0
	while (index < result.length) {
		let prodObj = {
			prod_id: result[index].prod_id,
			prod_name: result[index].prod_name,
			prod_category_id: result[index].prod_category_id,
			prod_category_name: result[index].cate_name,
			prod_amount: result[index].prod_amount,
			prod_description: result[index].prod_description,
			prod_created_date: moment(result[index].prod_created_date).format('DD/MM/YYYY'),
			prod_updated_date: moment(result[index].prod_updated_date).format('DD/MM/YYYY') == 'Invalid date' ? moment(result[index].prod_created_date).format('DD/MM/YYYY') : moment(result[index].prod_updated_date).format('DD/MM/YYYY'),
			prod_price: result[index].prod_price
		}
		
		let imageLink = []
		for (let i = index; i < result.length; i++) {
			index = i + 1
			imageLink.push(result[i].prod_img_data)

			if ((i >= result.length - 1) || (result[index].prod_id != result[index - 1].prod_id)) {
				break;
			}
		}
		prodObj['images'] = imageLink
		prodList.push(prodObj)
	}

	if (result) {
		return res.status(200).json({
			numberOfPage: numberPage,
			listProduct: prodList,
			statusCode: successCode
		})
	}
})


router.post('/list-best-sale', validator.listBestSale, async (req, res) => {
	const { limit, page } = req.body

	const offset = limit * (page - 1)

	if (page < 1 || limit < 1 || limit > 10) {
		return res.status(400).json({
			errorMessage: "limit and page parameter is not valid",
			statusCode: errorCode
		})
	}

	var result = await knex.raw(`with productSale as(
		select sum(bde.bdetail_quantity) as quantity,pro.* from (tbl_product pro join
		tbl_bill_detail bde on pro.prod_id = bde.bdetail_product_id)
		group by pro.prod_id
		order by quantity desc
		limit ${limit} offset ${offset}
	)
	select distinct pr.*,img.prod_img_data from productSale pr left join tbl_product_images img
	on img.prod_img_product_id = pr.prod_id order by pr.quantity desc`)

	result = result.rows

	var numberPage = await knex.raw('select count(DISTINCT bdetail_product_id) from tbl_bill_detail')

	numberPage = Number(numberPage.rows[0].count)
	if (numberPage > limit) {
		numberPage = Math.ceil(numberPage / limit)
	}
	else {
		numberPage = 1
	}

	//process return list
	var prodList = []

	var index = 0
	while (index < result.length) {
		let prodObj = {
			prod_id: result[index].prod_id,
			prod_name: result[index].prod_name,
			prod_category_id: result[index].prod_category_id,
			prod_amount: result[index].prod_amount,
			prod_description: result[index].prod_description,
			prod_created_date: result[index].prod_created_date,
			prod_updated_date: result[index].prod_updated_date,
			prod_price: result[index].prod_price,
			quantity: result[index].quantity
		}
		let imageLink = result[index].prod_img_data

		if (index === 0) {
			prodObj['images'] = imageLink
			prodList.push(prodObj)
		}
		if (result[index].prod_id !== prodList[prodList.length - 1].prod_id) {
			prodObj['images'] = imageLink
			prodList.push(prodObj)
		}
		index += 1
	}

	if (result) {
		return res.status(200).json({
			numberOfPage: numberPage,
			listProduct: prodList,
			statusCode: successCode
		})
	}
	else {
		return res.status(200).json({
			listProduct: [],
			statusCode: errorCode
		})
	}

})



router.post('/list-suggestion', validator.listSuggestion, async (req, res) => {
	const { limit, page, catID } = req.body
	const offset = limit * (page - 1)


	if (page < 1 || limit < 1 || limit > 10) {
		return res.status(400).json({
			errorMessage: "limit and page parameter is not valid",
			statusCode: errorCode
		})
	}

	var numberPage = await knex.raw(`select count(distinct tbl_product.prod_id) 
	from tbl_product join tbl_comment on tbl_product.prod_id = tbl_comment.cmt_product_id
	where tbl_product.prod_category_id = ${catID}`)


	numberPage = Number(numberPage.rows[0].count)
	if (numberPage > limit) {
		numberPage = Math.ceil(numberPage / limit)
	}
	else {
		numberPage = 1
	}


	var result = await knex.raw(`with product as(
		select tbl_product.*, round(avg(tbl_comment.cmt_vote),2) as avgStar
		from tbl_product join tbl_comment on tbl_product.prod_id = tbl_comment.cmt_product_id
		where tbl_product.prod_category_id = ${catID}
		group by tbl_product.prod_id
		offset ${offset}
		limit ${limit}
	)
	select pr.*,img.prod_img_data from product pr left join tbl_product_images img
	on img.prod_img_product_id = pr.prod_id order by avgStar desc`)

	result = result.rows


	//process return list
	var prodList = []

	var index = 0
	while (index < result.length) {
		let prodObj = {
			prod_id: result[index].prod_id,
			prod_name: result[index].prod_name,
			prod_category_id: result[index].prod_category_id,
			prod_amount: result[index].prod_amount,
			prod_description: result[index].prod_description,
			prod_created_date: result[index].prod_created_date,
			prod_updated_date: result[index].prod_updated_date,
			prod_price: result[index].prod_price,
			avgStar: result[index].avgstar
		}
		let imageLink = result[index].prod_img_data
		if (index === 0) {
			prodObj['images'] = imageLink
			prodList.push(prodObj)
		}
		if (result[index].prod_id !== prodList[prodList.length - 1].prod_id) {
			prodObj['images'] = imageLink
			prodList.push(prodObj)
		}
		index += 1
	}


	if (result) {
		return res.status(200).json({
			numberOfPage: numberPage,
			listProduct: prodList,
			statusCode: successCode
		})
	}
	else {
		return res.status(200).json({
			listProduct: [],
			statusCode: errorCode
		})
	}

})

router.post('/list-by-cat', validator.listByCategory, async (req, res) => {
	const { limit, page, catID } = req.body
	const offset = limit * (page - 1)
	var numberPage = await knex.raw(`select count(distinct tbl_product.prod_id) 
	from tbl_product 
	where tbl_product.prod_category_id = ${catID}`)
	numberPage = Number(numberPage.rows[0].count)
	if (numberPage > limit) {
		numberPage = Math.ceil(numberPage / limit)
	}
	else {
		numberPage = 1
	}

	if (page < 1 || limit < 1 || limit > 10) {
		return res.status(400).json({
			errorMessage: "limit and page parameter is not valid",
			statusCode: errorCode
		})
	}

	//cat not exists
	var result = await knex.raw(`with product as(
		select * from tbl_product
		where tbl_product.prod_category_id = ${catID}
		order by prod_created_date desc
		offset ${offset}
		limit ${limit}
	)
	select pr.*,img.prod_img_data from product pr left join tbl_product_images img
	on img.prod_img_product_id = pr.prod_id`)

	result = result.rows
	console.log(result)

	//process return list
	var prodList = []

	var index = 0
	while (index < result.length) {
		let prodObj = {
			prod_id: result[index].prod_id,
			prod_name: result[index].prod_name,
			prod_category_id: result[index].prod_category_id,
			prod_amount: result[index].prod_amount,
			prod_description: result[index].prod_description,
			prod_created_date: result[index].prod_created_date,
			prod_updated_date: result[index].prod_updated_date,
			prod_price: result[index].prod_price,
		}
		let imageLink = result[index].prod_img_data

		if (index === 0) {
			prodObj['images'] = imageLink
			prodList.push(prodObj)
		}
		if (result[index].prod_id !== prodList[prodList.length - 1].prod_id) {
			prodObj['images'] = imageLink
			prodList.push(prodObj)
		}
		index += 1
	}

	var numberOfProduct = await knex.raw(`select count(prod_id) from tbl_categories join tbl_product on tbl_product.prod_category_id = tbl_categories.cate_id where tbl_categories.cate_id = ${catID}`)


	if (result) {
		return res.status(200).json({
			numberOfPage: numberPage,
			numberProduct: numberOfProduct.rows[0],
			listProduct: prodList,
			statusCode: successCode
		})
	}
	else {
		return res.status(200).json({
			listProduct: [],
			statusCode: errorCode
		})
	}

})



router.get('/details/:id', async (req, res) => {
	const { id } = req.params

	var date = new Date();
	var prod = await knex('tbl_product')
		.where('prod_id', id)

	if (prod.length === 0) {
		return res.status(400).json({
			errorMessage: " Product record doesn't exist!",
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
		})
	if (prodObject) {
		return res.status(200).json({
			listProductDetail: prodObject,
			statusCode: successCode
		})
	}

	return res.status(200).json({
		listProductDetail: [],
		statusCode: errorCode
	})
})


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
			errorMessage: 'Product name accept only the length smaller than 60',
			statusCode: errorCode
		})
	}

	if (prodDescription.length > 1000) {
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

	if (prodAmount > 10000 || prodAmount < 0) {
		return res.status(400).json({
			errorMessage: 'Ammount is not valid, must be smaller than 10000 and greater than 0!',
			statusCode: errorCode
		})
	}

	if (prodPrice > 1000000000 || prodPrice < 0) {
		return res.status(400).json({
			errorMessage: 'Product price is not valid, must be smaller than 1000000000 or greater than 0 !',
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
		prod_description: prodDescription,
		prod_status: 1,
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
		if (prodName.length > 1000) {
			return res.status(400).json({
				errorMessage: 'Product name accept only the length smaller than 60',
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
		if (prodAmount > 10000 || prodAmount < 0) {
			return res.status(400).json({
				errorMessage: 'Ammount cannot greater than 10000 or smaller than 0 !',
				statusCode: errorCode
			})
		}
	}

	if (prodPrice != undefined) {
		if (prodPrice > 1000000000 || prodPrice < 0) {
			return res.status(400).json({
				errorMessage: 'Product price is not valid, cannot greater than 1000000000 or smaller than 0 !',
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
			prod_description: typeof prodDescription !== 'undefined' ? prodDescription : updateProduct[0].prod_price,
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
	var numberOfOldImage = imagesNameArray.length
	var prodImgNumber = await knex.raw(`select count(prod_img_product_id) from tbl_product_images where prod_img_product_id = ${id}`)
	prodImgNumber = prodImgNumber.rows[0].count


	if (5 - prodImgNumber + numberOfOldImage - numberOfNewImage <= 0) {
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
