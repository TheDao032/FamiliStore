const express = require('express')

const knex = require('../utils/dbConnection')
const router = express.Router()
const billValidation = require('../middlewares/validation/bill.validate')
const moment = require('moment')

const errorCode = 1
const successCode = 0


router.post('/add', billValidation.newBill, async (req, res) => {
	const { accId, totalPrice, totalQuantity, listProduct } = req.body

	let regexPattern = /^\d+$/
	let resultInteger = regexPattern.test(totalPrice);

	if (!resultInteger) {
		return res.status(400).json({
			errorMessage: 'Total price must be integer !',
			statusCode: errorCode
		})
	}

	if(isNaN(Number(accId))){
		return res.status(400).json({
			errorMessage: 'Account id must be of integer type',
			statusCode: errorCode
		})
	}

	var countId = 0
	var countAmount = 0

	const listProductDB = await knex('tbl_product')
	const accountDB = await knex('tbl_account').where("acc_id", accId)

	if(accountDB.length === 0){
		return res.status(400).json({
			errorMessage: 'account id not exists',
			statusCode: errorCode
		})
	}

	listProduct.forEach((prod) => {
		var exists = Object.keys(listProductDB).some(function(key) {
			if(listProductDB[key]['prod_id'] === Number(prod.prodId)){
				countId++

				if((listProductDB[key]['prod_amount'] - prod.prodQuantity) >= 0){
					return true
				}

				return false
			}
		})
		
		if(exists === true){
			countAmount++;
		}
	})
	
	if(countId !== listProduct.length){
		return res.status(400).json({
			errorMessage: 'product id not exists',
			statusCode: errorCode
		})
	}


	if(countAmount !== listProduct.length){
		return res.status(400).json({
			errorMessage: 'quantity exceeds the number that exists',
			statusCode: errorCode
		})
	}
	
	let present = moment().format('YYYY-MM-DD HH:mm:ss')
	var listObjectToJson = JSON.stringify(listProduct)

	//const dd = '[{"prodId": 1, "prod": "a"}, {"prodId": 2, "prod": "b"}]'
	const result = await knex.raw('Call proc_update_product_insert_bill_detail(?,?,?,?,?,?,?)',
									[listObjectToJson, accId, totalPrice, totalQuantity,present,0, ''])

	if(result.rows[0].resultcode === 1){
		return res.status(400).json({
			errorMessage: result.rows[0].message,
			statusCode: errorCode
		})
	}

	return res.status(200).json({
		message: result.rows[0].message,
		statusCode: successCode
	})
})


router.get('/details/:id', async (req, res) => {
	const { id } = req.params

	if(isNaN(Number(id))){
		return res.status(400).json({
			errorMessage: 'id must be of integer type',
			statusCode: errorCode
		})
	}

	const resultProductBdetail = await knex('tbl_bill_detail')
		.join('tbl_product', 'prod_id', 'bdetail_product_id')
		.where({bdetail_bill_id: id})

	const imageProduct = await knex('tbl_product_images')
	const bill = await knex('tbl_bill').where({bill_id: id})


	if (bill.length === 0 || resultProductBdetail.length === 0) {
		return res.status(400).json({
			errorMessage: 'bill id not exists',
			statusCode: errorCode
		})
	}
	
	var listItem = []
	var index = 0

	resultProductBdetail.forEach((proBdetail) =>{
		var image = ''
		var exists = Object.keys(imageProduct).some(function(key) {
			if(imageProduct[key]['prod_img_product_id'] === proBdetail.prod_id){
				image = imageProduct[key]['prod_img_data']
			}
		})

		var item = {
			id: proBdetail.bdetail_product_id,
			title: proBdetail.prod_name,
			price: Number(proBdetail.bdetail_product_price),
			description: proBdetail.prod_description,
			image: image,
			categoryId: proBdetail.prod_category_id,
			salePrice: null,
			quantity: proBdetail.bdetail_quantity,
			TotalPrice: proBdetail.bdetail_quantity * Number(proBdetail.bdetail_product_price)
		}
		
		listItem[index] = item
		index++
	})

	return res.status(200).json({
		listProductInBill: listItem,
		TotalPrice: Number(bill[0].bill_total_price),
		statusCode: successCode
	})

})

router.get('/history-bill/:id', async (req, res) => {
	const { id } = req.params

	if(isNaN(Number(id))){
		return res.status(400).json({
			errorMessage: 'id must be of integer type',
			statusCode: errorCode
		})
	}

	const resultProductBdetail = await knex('tbl_bill')
		.join('tbl_bill_detail', 'bdetail_bill_id', 'bill_id')
		.join('tbl_product', 'prod_id', 'bdetail_product_id')
		.where({bill_account_id: id}).orderBy('bill_created_date', 'desc')

	if (resultProductBdetail.length === 0) {
		return res.status(400).json({
			errorMessage: 'account id not exists',
			statusCode: errorCode
		})
	}
	
	var listItem = []
	var index = 0

	resultProductBdetail.forEach((proBdetail) =>{
		var expectedDate = new Date(proBdetail.bill_created_date)
		expectedDate.setDate(expectedDate.getDate() + 2)

		var createdDate = moment(proBdetail.bill_created_date).format('DD/MM/YYYY HH:mm:ss')
		expectedDate = moment(new Date(expectedDate)).format('DD/MM/YYYY HH:mm:ss')
		var status = 'packing'

		if(proBdetail.bill_status === 1){
			status = 'transported'
		}

		else if(proBdetail.bill_status === 2){
			status = 'recieve'
		}

		var item = {
			id: proBdetail.bdetail_id,
			title: proBdetail.prod_name,
			price: Number(proBdetail.bdetail_product_price),
			description: proBdetail.prod_description,
			status: status,
			createDate: createdDate,
			expectedDate: expectedDate
		}

		listItem[index] = item
		index++
	})

	return res.status(200).json({
		listItemOfAccount: listItem,
		statusCode: successCode
	})
})


router.post('/update-status', billValidation.updateStatusBill, async (req, res) => {
	const { billId, status } = req.body
	var upStatus = 0

	if(isNaN(Number(billId))){
		return res.status(400).json({
			errorMessage: 'Bill id must be of integer type',
			statusCode: errorCode
		})
	}
	const resultBill = await knex('tbl_bill').where("bill_id", billId)

	if(resultBill.length === 0){
		return res.status(400).json({
			errorMessage: 'bill id not exists',
			statusCode: errorCode
		})
	}

	//packing
	if(status === 'transported'){
		upStatus = 1
	}

	else if(status === 'recieve'){
		upStatus = 2
	}

	let present = moment().format('YYYY-MM-DD HH:mm:ss')

	await knex('tbl_bill').where("bill_id", billId).update({bill_status: upStatus, bill_updated_date: present})

	return res.status(200).json({
		statusCode: successCode
	})
})

router.get('/test', async (req, res) => {
	const { limit, page } = req.body

	const offset = limit * (page - 1)

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
	console.log(result)

	if (page < 1 || limit < 1 || limit > 10) {
		return res.status(400).json({
			errorMessage: "limit and page parameter is not valid",
			statusCode: errorCode
		})
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
			listProduct: prodList,
			statusCode: successCode
		})
	}

	else {
		return res.status(400).json({
			listProduct: [],
			statusCode: errorCode
		})
	}
})
module.exports = router
