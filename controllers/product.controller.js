const express = require('express')
const router = express.Router()
const knex = require('../utils/dbConnection')
const moment = require('moment');
const imageService = require('../services/imageService')
const imageValidator = require('../middlewares/validation/image.validate')
const commonService = require('../services/commonService')
const validator = require('../middlewares/validation/product.validate')
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
		select * from tbl_product
		order by prod_created_date desc
		offset ${offset}
		limit ${limit}
	)
	select pr.*, img.prod_img_data from product pr left join tbl_product_images img
	on img.prod_img_product_id = pr.prod_id`)
	result = result.rows


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
	else {
		return res.status(500).json({
			listProduct: [],
			statusCode: errorCode
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
	result = result.rows

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

router.post('/list-by-cat', async (req, res) => {
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
	if (prodName === undefined || prodCategoryID === undefined || prodAmount === undefined || prodPrice === undefined || req.files.image === undefined) {
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
	var errorFromValidateImage = imageValidator.validateValidImage(images)

	if (errorFromValidateImage !== '') {
		errorMessage = errorMessage + errorFromValidateImage
	}

	if (errorMessage !== "") {
		return res.status(400).json({
			errorMessage: errorMessage,
			statusCode: errorCode
		})
	}

	images = imageService.getImage(images)

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

			if (images.length === undefined) {// number of uploaded image is 1
				await imageService.productUploader(images, rows[0].prod_id, 'insert')
			}
			else {
				for (let i = 0; i < images.length; i++) {
					await imageService.productUploader(images[i], rows[0].prod_id, 'insert')
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

	var prod = await knex('tbl_product')
		.where('prod_name', prodName)
		.andWhere('prod_category_id', prodCategoryID)

	var updateProduct = await knex('tbl_product')
		.where('prod_id', id)

	var cat = await knex('tbl_categories')
		.where('cate_id', prodCategoryID)

	if (cat.length === 0) {
		errorMessage = " Category doesn't exists!"
	}

	if (prod.length !== 0) {
		errorMessage = errorMessage + " Product record with the same name exist!"
	}

	if (updateProduct.length === 0) {
		errorMessage = errorMessage + " Product record to update doesn't exist!"
	}

	if (errorMessage !== '') {
		return res.status(400).json({
			errorMessage: errorMessage,
			statusCode: errorCode
		})
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

	var imagesNameArray = imageName.split(",")

	var errorMessage = ''

	var result = await knex.from('tbl_product')
		.where('prod_id', id)

	if (result.length === 0) {
		errorMessage = errorMessage + " Product record doesn't exist!"
	}

	//validate image
	var errorFromValidateImage = imageValidator.validateValidImage(images)

	if (errorFromValidateImage !== '') {
		errorMessage = errorMessage + errorFromValidateImage
	}
	//validate old image & new image length
	var newImageLength = imageService.getImageLength(images.image)
	var oldimageLength = imagesNameArray.length

	if (newImageLength !== oldimageLength) {
		errorMessage = errorMessage + " Old image links and new uploaded image doesn't have the consistency about length!"
	}

	if (errorMessage !== '') {
		return res.status(400).json({
			errorMessage: errorMessage,
			statusCode: errorCode
		})
	}

	images = imageService.getImage(images)

	//uploadd image

	if (images.length === undefined) {// number of uploaded image is 1
		let promiseToUploadImage = new Promise(async function (resolve) {
			await imageService.productUploader(images, id, 'update', imagesNameArray[0])
			resolve();
		})
		promiseToUploadImage.then(function () {
			imageService.deleteImage(imagesNameArray[0])
		})

	}
	else {
		for (let i = 0; i < newImageLength; i++) {
			//upload new image and delete old image on cloud
			let promiseToUploadImage = new Promise(async function (resolve) {
				await imageService.productUploader(images[i], id, 'update', imagesNameArray[i])
				resolve();
			})
			promiseToUploadImage.then(function () {
				imageService.deleteImage(imagesNameArray[i])
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
			errorMessage: errorMessage,
			statusCode: 1
		})
	}


	//delete image of product
	await knex('tbl_product_images').where('prod_img_product_id', id).del()
		.returning('*')
		.then((deleted) => {
			for (let i = 0; i < deleted.length; i++) {
				imageService.deleteImage(deleted[i].prod_img_data);
			}

		})

	//delete product

	await knex('tbl_product').where('prod_id', id).del()


	return res.status(200).json({
		statusCode: successCode
	})
})

module.exports = router
