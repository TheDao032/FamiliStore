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


	if (page < 1 || limit < 1) {
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

	if (page < 1 || limit < 1) {
		return res.status(400).json({
			errorMessage: "limit and page parameter is not valid",
			statusCode: errorCode
		})
	}

	var result = await knex.raw(`with productSale as(
		select sum(bde.bdetail_quantity) as quantity,pro.* from (tbl_product pro 
		join tbl_bill_detail bde on pro.prod_id = bde.bdetail_product_id)
		group by pro.prod_id
		order by quantity desc
		limit ${limit}
		offset ${offset}
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
			prod_created_date: moment(result[index].prod_created_date).format('DD/MM/YYYY'),
			prod_updated_date: moment(result[index].prod_updated_date).format('DD/MM/YYYY') == 'Invalid date' ? moment(result[index].prod_created_date).format('DD/MM/YYYY') : moment(result[index].prod_updated_date).format('DD/MM/YYYY'),
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


	if (page < 1 || limit < 1) {
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
			prod_created_date: moment(result[index].prod_created_date).format('DD/MM/YYYY'),
			prod_updated_date: moment(result[index].prod_updated_date).format('DD/MM/YYYY') == 'Invalid date' ? moment(result[index].prod_created_date).format('DD/MM/YYYY') : moment(result[index].prod_updated_date).format('DD/MM/YYYY'),
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

	var whereClause = 'and prod_status != 1 and prod_amount > 0'
	if (req.hasHeader) {
		if (req.account.accRole == 'ADM') {
			whereClause = ''
		}
	}

	var numberPage = await knex.raw(`select count(distinct tbl_product.prod_id) 
	from tbl_product 
	where tbl_product.prod_category_id = ${catID} ${whereClause}`)

	numberPage = Number(numberPage.rows[0].count)
	if (numberPage > limit) {
		numberPage = Math.ceil(numberPage / limit)
	}
	else {
		numberPage = 1
	}

	if (page < 1 || limit < 1) {
		return res.status(400).json({
			errorMessage: "limit and page parameter is not valid",
			statusCode: errorCode
		})
	}


	var result = await knex.raw(`with product as(
		select * from tbl_product
		where tbl_product.prod_category_id = ${catID} ${whereClause}
		order by prod_created_date desc
		offset ${offset}
		limit ${limit}
	)
	select pr.*,img.prod_img_data, cat.* from product pr 
	left join tbl_product_images img on img.prod_img_product_id = pr.prod_id 
	left join tbl_categories cat on cat.cate_id = pr.prod_category_id`)

	result = result.rows

	//process return list
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
			prod_price: result[index].prod_price,
		}
		let imageLink = result[index].prod_img_data
		//push the first record to prodLIst
		if (index === 0) {
			prodObj['images'] = imageLink
			prodList.push(prodObj)
		}
		//push the next first record to prod list
		if (result[index].prod_id !== prodList[prodList.length - 1].prod_id) {
			prodObj['images'] = imageLink
			prodList.push(prodObj)
		}
		index += 1
	}

	var numberOfProduct = await knex.raw(`select count(prod_id) from tbl_categories join tbl_product on tbl_product.prod_category_id = tbl_categories.cate_id where tbl_categories.cate_id = ${catID} ${whereClause}`)


	if (result) {
		return res.status(200).json({
			numberOfPage: numberPage,
			numberProduct: numberOfProduct.rows[0].count,
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

router.post('/search', validator.productSearching, async (req, res) => {
	//I don't want to change it to const and take time to do coding for some bull shit thing, so var is the best choice
	var { prodName, limit, page, sortBy, filter } = req.body
	var offset = limit * (page - 1)

	if (filter == undefined) {
		filter = 'prod_created_date'

	}

	if (sortBy == undefined) {
		sortBy = 'asc'

	}

	var whereClause = 'and prod_status != 1 and prod_amount > 0'
	if (req.hasHeader) {
		if (req.account.accRole == 'ADM') {
			whereClause = ''
		}
	}

	if (filter != 'prod_name' && filter != 'prod_amount' && filter != 'prod_created_date' && filter != 'prod_updated_date' && filter != 'prod_price') {
		return res.status(400).json({
			errorMessage: "filter is invalid!",
			statusCode: errorCode
		})
	}


	if (sortBy && sortBy != 'asc' && sortBy != 'desc') {
		return res.status(400).json({
			errorMessage: "sort by is invalid!",
			statusCode: errorCode
		})
	}

	if (page < 1 || limit < 1) {
		return res.status(400).json({
			errorMessage: "limit and page parameter is not valid",
			statusCode: errorCode
		})
	}

	var numberPage = await knex.raw(`SELECT count(prod_id)
	FROM tbl_product
	WHERE ts @@ to_tsquery('english', '${prodName}') ${whereClause}`)

	numberPage = Number(numberPage.rows[0].count)
	if (numberPage > limit) {
		numberPage = Math.ceil(numberPage / limit)
	}
	else {
		numberPage = 1
	}

	//FULL TEXT SEARCH
	var result = await knex.raw(`with product as (
		SELECT *
		FROM tbl_product
		WHERE ts @@ to_tsquery('english', '${prodName}') ${whereClause}
		limit ${limit}
		offset ${offset}
	)
	select pr.*,img.prod_img_data from product pr left join tbl_product_images img
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
			prod_created_date: moment(result[index].prod_created_date).format('DD/MM/YYYY'),
			prod_updated_date: moment(result[index].prod_updated_date).format('DD/MM/YYYY') == 'Invalid date' ? moment(result[index].prod_created_date).format('DD/MM/YYYY') : moment(result[index].prod_updated_date).format('DD/MM/YYYY'),
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

	if (sortBy == 'asc')
		prodList.sort(function (a, b) { return a[filter] - b[filter] })
	else if (sortBy == 'desc')
		prodList.sort(function (a, b) { return b[filter] - a[filter] })

	var numberOfProduct = await knex.raw(`SELECT count(prod_id) FROM tbl_product WHERE ts @@ to_tsquery('english', '${prodName}') ${whereClause}`)

	if (result) {
		return res.status(200).json({
			numberOfPage: numberPage,
			numberProduct: numberOfProduct.rows[0].count,
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

module.exports = router
