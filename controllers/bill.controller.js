const express = require('express')

const knex = require('../utils/dbConnection')
const router = express.Router()
const billValidation = require('../middlewares/validation/bill.validate')
const moment = require('moment')

const errorCode = 1
const successCode = 0

router.post('/list-details', billValidation.listBillDetail, async (req, res) => {
	const { accId, billId } = req.body
	
	const result = await knex('tbl_bill')
		.join('tbl_bill_detail', 'bill_id', 'bdetail_bill_id')
		.join('tbl_product', 'prod_id', 'bdetail_product_id')
		.where({ bill_account_id: accId, bill_id: billId, bill_status: 0 })

	if (result.length === 0) {
		return res.status(404).json({
			listBillDetail: [],
			statusCode: errorCode
		})
	}

	return res.status(404).json({
		listBillDetail: result,
		statusCode: successCode
	})
})

router.post('/add', billValidation.newBill, async (req, res) => {
	const { accId, totalPrice, totalQuantity, listProduct } = req.body

	var countId = 0
	var countAmount = 0

	const listProductDB = await knex('tbl_product')
	const accountDB = await knex('tbl_account').where("acc_id", accId)

	if(accountDB.length === 0){
		return res.status(404).json({
			errorMessage: 'account id not exists',
			statusCode: errorCode
		})
	}

	listProduct.forEach((prod) => {
		var exists = Object.keys(listProductDB).some(function(key) {
			if(listProductDB[key]['prod_id'] === prod.prodId){
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
		return res.status(404).json({
			errorMessage: 'product id not exists',
			statusCode: errorCode
		})
	}

	if(countAmount !== listProduct.length){
		return res.status(404).json({
			errorMessage: 'quantity exceeds the number that exists',
			statusCode: errorCode
		})
	}
	
	let present = new Date()
	var listObjectToJson = JSON.stringify(listProduct)

	//const dd = '[{"prodId": 1, "prod": "a"}, {"prodId": 2, "prod": "b"}]'
	const result = await knex.raw('Call proc_update_product_insert_bill_detail(?,?,?,?,?,?,?)',
									[listObjectToJson, accId, totalPrice, totalQuantity,present,0, ''])

	if(result.rows[0].resultcode === 1){
		return res.status(500).json({
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
		return res.status(404).json({
			message: 'id must be of integer type',
			statusCode: errorCode
		})
	}

	const resultProductBdetail = await knex('tbl_bill_detail')
		.join('tbl_product', 'prod_id', 'bdetail_product_id')
		.where({bdetail_bill_id: id})

	const imageProduct = await knex('tbl_product_images')
	const bill = await knex('tbl_bill').where({bill_id: id})

	if (bill.length === 0 || resultProductBdetail.length === 0) {
		return res.status(404).json({
			message: 'bill id not exists',
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
			salePrice: Number(proBdetail.prod_sale_price),
			quantity: proBdetail.bdetail_quantity,
			TotalPrice: proBdetail.bdetail_quantity * Number(proBdetail.prod_sale_price)
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
		return res.status(404).json({
			message: 'id must be of integer type',
			statusCode: errorCode
		})
	}

	const resultProductBdetail = await knex('tbl_bill_detail')
		.join('tbl_product', 'prod_id', 'bdetail_product_id')
		.where({bdetail_bill_id: id})

	const bill = await knex('tbl_bill').where({bill_id: id})

	if (bill.length === 0 || resultProductBdetail.length === 0) {
		return res.status(404).json({
			message: 'bill id not exists',
			statusCode: errorCode
		})
	}

	var expectedDate = new Date(bill[0].bill_created_date);
    expectedDate.setDate(expectedDate.getDate() + 2);

	createdDate = moment(bill[0].bill_created_date).format('DD/MM/YYYY');
	expectedDate = moment(new Date(expectedDate)).format('DD/MM/YYYY');
	
	var listItem = []
	var index = 0

	resultProductBdetail.forEach((proBdetail) =>{
		var item = {
			id: proBdetail.bdetail_product_id,
			title: proBdetail.prod_name,
			price: Number(proBdetail.bdetail_product_price),
			description: proBdetail.prod_description,
			status: bill[0].bill_status,
			createDate: createdDate,
			expectedDate: expectedDate
		}
		listItem[index] = item
		index++
	})

	return res.status(200).json({
		listItemInBill: listItem,
		statusCode: successCode
	})
})

module.exports = router
