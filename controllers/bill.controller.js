const express = require('express')

const knex = require('../utils/dbConnection')
const router = express.Router()
const billValidation = require('../middlewares/validation/bill.validate')
const moment = require('moment')
const mailService = require('../services/mailService')
const mailOptions = require('../template/mailOptions')
const modelBill = require('../models/bill.model')
const { compileSchema } = require('ajv/dist/compile')

const errorCode = 1
const successCode = 0


router.post('/add', billValidation.newBill, async (req, res) => {
	const { accAddress, priceShip, listProduct } = req.body	

	let regexPattern = /^\d+$/
	let resultInteger = regexPattern.test(priceShip);
	
	if (!resultInteger) {
		return res.status(400).json({
			errorMessage: 'Total price must be integer !',
			statusCode: errorCode
		})
	}

	const listProductDB = await knex('tbl_product')
	const accountDB = await knex('tbl_account').where("acc_id", req.account['accId'])

	if(accountDB.length === 0){
		return res.status(400).json({
			errorMessage: 'account id not exists',
			statusCode: errorCode
		})
	}
	
	const resultCheck = await modelBill.checkAmountProduct(listProduct, listProductDB, priceShip)

	if(resultCheck['message'] !== ''){
		return res.status(400).json({
			errorMessage: resultCheck.message,
			statusCode: errorCode
		})
	}
	
	//time current
	let present = moment().format('YYYY-MM-DD HH:mm:ss')
	var listObjectToJson = JSON.stringify(listProduct)

	//const dd = '[{"prodId": 1, "prod": "a"}, {"prodId": 2, "prod": "b"}]'
	const result = await knex.raw('Call proc_update_product_insert_bill_detail(?,?,?,?,?,?,?,?,?)',
									[listObjectToJson, req.account['accId'], accAddress, resultCheck['totalPrice'].toString(), priceShip,resultCheck['totalQuantity'],present,0, ''])

	if(result.rows[0].resultcode === 1){
		return res.status(400).json({
			errorMessage: result.rows[0].message,
			statusCode: errorCode
		})
	}

	const resultBill = await knex.raw(`select max(bill_id) from tbl_bill where bill_account_id = ${req.account['accId']} and bill_created_date like '${present.toString()}'`)
	
	const resultProductBdetail = await knex('tbl_bill')
		.join('tbl_bill_detail', 'bdetail_bill_id', 'bill_id')
		.join('tbl_product', 'prod_id', 'bdetail_product_id')
		.where({bill_id: resultBill.rows[0].max}).orderBy('bill_created_date', 'desc')

	await mailService.sendMail(mailOptions.verifyBillOptions(accountDB[0], resultProductBdetail, accAddress), req, res)

	return res.status(200).json({
		statusCode: successCode
	})
})


router.post('/details',billValidation.billDetail, async (req, res) => {
	const { billId } = req.body

	var resultProductBdetail = await knex.raw(`with billList as (	
		with bill as (select * from tbl_bill where bill_id = ${billId}
		)
		select * from bill 
		left join tbl_bill_detail detail on detail.bdetail_bill_id = bill.bill_id
		left join tbl_product product on product.prod_id = detail.bdetail_product_id
		left join tbl_categories cat on cat.cate_id = product.prod_category_id
		left join tbl_account acc on acc.acc_id = bill.bill_account_id
	)
	select * from billList left join tbl_product_images images on billList.bdetail_product_id = images.prod_img_product_id`)

	resultProductBdetail = resultProductBdetail.rows

	var moveToNextBill = false
	var index = 0

	if(resultProductBdetail.length === 0){
		return res.status(400).json({
			errorMessage: 'Bill id not exist',
			statusCode: errorCode
		})
	}
	while (index < resultProductBdetail.length) {

		var expectedDate = new Date(resultProductBdetail[index].bill_created_date)
		expectedDate.setDate(expectedDate.getDate() + 2)

		var createdDate = moment(resultProductBdetail[index].bill_created_date).format('DD/MM/YYYY HH:mm:ss')
		expectedDate = moment(new Date(expectedDate)).format('DD/MM/YYYY HH:mm:ss')
		var status = 'shipping'

		if (resultProductBdetail[index].bill_status === 1) {
			status = 'delivered'
		}

		else if (resultProductBdetail[index].bill_status === 2) {
			status = 'cancel'
		}

		var billItem = {
			billId: resultProductBdetail[index].bill_id,
			accountID: resultProductBdetail[index].bill_account_id,
			totalPrice: resultProductBdetail[index].bill_total_price,
			billQuantity: resultProductBdetail[index].bill_total_quantity,
			billStatus: status,
			priceShip: resultProductBdetail[index].bill_price_ship,
			billAddress: resultProductBdetail[index].bill_address,
			fullName: resultProductBdetail[index].acc_full_name,
			phoneNumber: resultProductBdetail[index].acc_phone_number,
			createDate: createdDate,
			expectedDate: expectedDate,
		}

		let prodList = []

		for (let i = index; i < resultProductBdetail.length; i++) {
			if (i === 0) {
				let prodObj = {
					productID: resultProductBdetail[index].prod_id,
					prodName: resultProductBdetail[index].prod_name,
					prodCategory: resultProductBdetail[index].cate_name,
					prodQuantity: resultProductBdetail[index].prod_amount,
					prodDescription: resultProductBdetail[index].prod_description,
					prodCreatedDate: moment(resultProductBdetail[index].prod_created_date).format('DD/MM/YYYY'),
					prodUpdatedDate: moment(resultProductBdetail[index].prod_updated_date).format('DD/MM/YYYY') == 'Invalid date' ? moment(resultProductBdetail[index].prod_created_date).format('DD/MM/YYYY') : moment(resultProductBdetail[index].prod_updated_date).format('DD/MM/YYYY'),
					prodPrice: resultProductBdetail[index].prod_price
				}
				let imageLink = resultProductBdetail[i].prod_img_data
				prodObj['images'] = imageLink
				prodList.push(prodObj)
			}

			if ((i >= resultProductBdetail.length - 1) || (resultProductBdetail[i + 1].bill_id != resultProductBdetail[i].bill_id)) {				
				index = i + 1
				moveToNextBill = true
				break
			}
			else {
				if (moveToNextBill == true) {
					i--
					moveToNextBill = false
				}
				else {
					index = i + 1
				}
			}

			let prodObj = {
				productID: resultProductBdetail[index].prod_id,
				prodName: resultProductBdetail[index].prod_name,
				prodCategory: resultProductBdetail[index].cate_name,
				prodQuantity: resultProductBdetail[index].prod_amount,
				prodDescription: resultProductBdetail[index].prod_description,
				prodCreatedDate: moment(resultProductBdetail[index].prod_created_date).format('DD/MM/YYYY'),
				prodUpdatedDate: moment(resultProductBdetail[index].prod_updated_date).format('DD/MM/YYYY') == 'Invalid date' ? moment(resultProductBdetail[index].prod_created_date).format('DD/MM/YYYY') : moment(resultProductBdetail[index].prod_updated_date).format('DD/MM/YYYY'),
				prodPrice: resultProductBdetail[index].prod_price
			}
			let imageLink = resultProductBdetail[index].prod_img_data
			prodObj['images'] = imageLink
			
			if (index < resultProductBdetail.length && (resultProductBdetail[index].prod_id != resultProductBdetail[index - 1].prod_id)) {
				prodList.push(prodObj)
			}
			else if (index < resultProductBdetail.length && (resultProductBdetail[index].bill_id != resultProductBdetail[index - 1].bill_id) && (resultProductBdetail[index].prod_id == resultProductBdetail[index - 1].prod_id)){
				prodList.push(prodObj)
			}
		}
		billItem['billDetailList'] = prodList
	}

	return res.status(200).json({
		ListDetail: billItem,
		statusCode: successCode
	})

})

router.post('/update-status', billValidation.updateStatusBill, async (req, res) => {
	const { billId, status } = req.body

	if(!(status === 'shipping' || status === 'delivered' || status === 'cancel')){
		return res.status(400).json({
			errorMessage: 'Status must be in 4 states(shipping, delivered, cancel)',
			statusCode: errorCode
		})
	}

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
	if(status === 'shipping'){
		upStatus = 0
	}

	if(status === 'delivered'){
		upStatus = 1
	}

	else if( status === 'cancel' && resultBill[0].bill_status === 2){
		return res.status(200).json({
			statusCode: successCode
		})
	}

	else if(status === 'cancel'){
		if(resultBill[0].bill_status !== 1){
			await knex.raw(`update tbl_product
							set prod_amount = tbl_product.prod_amount + pro.bdetail_quantity,
								prod_updated_date = current_date
							from (
								select * from (tbl_bill b join tbl_bill_detail bd on bd.bdetail_bill_id = b.bill_id)
								join tbl_product pr on pr.prod_id = bd.bdetail_product_id
								where b.bill_id = ${billId}
							) pro
							where tbl_product.prod_id = pro.prod_id`)

			upStatus = 2
		}

		else{
			return res.status(400).json({
				errorMessage: 'The order has been delivered and cannot be canceled',
				statusCode: errorCode
			})
		}
	}
	var check = false

	if(resultBill[0].bill_status === 2){

		var listTotalProduct = await knex('tbl_bill')
		.join('tbl_bill_detail', 'bdetail_bill_id', 'bill_id')
		.join('tbl_product', 'prod_id', 'bdetail_product_id')
		.where({bill_id: billId})
	
		listTotalProduct.forEach((prod) => {
			if(prod.prod_amount < prod.bdetail_quantity){
				check = true
			}
		})

		if(check === true){
			return res.status(400).json({
				errorMessage: 'quantity exceeds the number that exists',
				statusCode: errorCode
			})
		}

		await knex.raw(`update tbl_product
							set prod_amount = tbl_product.prod_amount - pro.bdetail_quantity,
								prod_updated_date = current_date
							from (
								select * from (tbl_bill b join tbl_bill_detail bd on bd.bdetail_bill_id = b.bill_id)
								join tbl_product pr on pr.prod_id = bd.bdetail_product_id
								where b.bill_id = ${billId}
							) pro
							where tbl_product.prod_id = pro.prod_id`)
	}

	let present = moment().format('YYYY-MM-DD HH:mm:ss')

	await knex('tbl_bill').where("bill_id", billId).update({bill_status: upStatus, bill_updated_date: present})
	await knex('tbl_bill_detail').where("bdetail_bill_id", billId).update({bdetail_status: upStatus, bdetail_updated_date: present})

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/cancel-bill', billValidation.cancelBill, async (req, res) => {
	const { billId } = req.body

	const resultBill = await knex('tbl_bill').where("bill_id", billId)

	if(resultBill.length === 0){
		return res.status(400).json({
			errorMessage: 'bill id not exists',
			statusCode: errorCode
		})
	}

	if( resultBill[0].bill_status === 2){
		return res.status(200).json({
			statusCode: successCode
		})
	}

	await knex.raw(`update tbl_product
							set prod_amount = tbl_product.prod_amount + pro.bdetail_quantity,
								prod_updated_date = current_date
							from (
								select * from (tbl_bill b join tbl_bill_detail bd on bd.bdetail_bill_id = b.bill_id)
								join tbl_product pr on pr.prod_id = bd.bdetail_product_id
								where b.bill_id = ${billId}
							) pro
							where tbl_product.prod_id = pro.prod_id`)

	var upStatus = 2

	let present = moment().format('YYYY-MM-DD HH:mm:ss')

	await knex('tbl_bill').where("bill_id", billId).update({bill_status: upStatus, bill_updated_date: present})
	await knex('tbl_bill_detail').where("bdetail_bill_id", billId).update({bdetail_status: upStatus, bdetail_updated_date: present})

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/list', billValidation.listBill, async (req, res) => {
	const { limit, page } = req.body
	const offset = limit * (page - 1)

	if (page < 1 || limit < 1 || limit > 10) {
		return res.status(400).json({
			errorMessage: "limit and page parameter is not valid",
			statusCode: errorCode
		})
	}

	var resultProductBdetail = await knex.raw(`with billList as (	
		with bill as (select * from tbl_bill
			limit ${limit}
			offset ${offset}
		)
		select * from bill 
		left join tbl_bill_detail detail on detail.bdetail_bill_id = bill.bill_id
		left join tbl_product product on product.prod_id = detail.bdetail_product_id
		left join tbl_categories cat on cat.cate_id = product.prod_category_id
		order by bill.bill_id
	)
	select * from billList left join tbl_product_images images on billList.bdetail_product_id = images.prod_img_product_id order by billList.bill_id`)

	var resultOne = await knex.raw(`with bill as (select * from tbl_bill
		limit ${limit}
		offset ${offset}
	)
	select bill.bill_id, count(detail.bdetail_product_id) from bill 
	left join tbl_bill_detail detail on detail.bdetail_bill_id = bill.bill_id
	left join tbl_product product on product.prod_id = detail.bdetail_product_id
	group by bill.bill_id 
	having count(detail.bdetail_product_id) = 1 `)

	resultOne = resultOne.rows
	resultProductBdetail = resultProductBdetail.rows	

	var moveToNextBill = false
	var billList = []
	var index = 0
	var checkOneDetail = false

	while (index < resultProductBdetail.length) {

		var expectedDate = new Date(resultProductBdetail[index].bill_created_date)
		expectedDate.setDate(expectedDate.getDate() + 2)

		var createdDate = moment(resultProductBdetail[index].bill_created_date).format('DD/MM/YYYY HH:mm:ss')
		expectedDate = moment(new Date(expectedDate)).format('DD/MM/YYYY HH:mm:ss')
		var status = 'shipping'

		if (resultProductBdetail[index].bill_status === 1) {
			status = 'delivered'
		}

		else if (resultProductBdetail[index].bill_status === 2) {
			status = 'cancel'
		}

		//return bill object
		var billItem = {
			billId: resultProductBdetail[index].bill_id,
			accountID: resultProductBdetail[index].bill_account_id,
			totalPrice: resultProductBdetail[index].bill_total_price,
			billQuantity: resultProductBdetail[index].bill_total_quantity,
			priceShip: resultProductBdetail[index].bill_price_ship,
			billStatus: status,
			createDate: createdDate,
			expectedDate: expectedDate,
		}

		let prodList = []
		var count = 1
		for (let i = index; i < resultProductBdetail.length; i++) {
			if (i === 0) {
				let prodObj = {
					productID: resultProductBdetail[index].prod_id,
					prodName: resultProductBdetail[index].prod_name,
					prodCategory: resultProductBdetail[index].cate_name,
					prodQuantity: resultProductBdetail[index].prod_amount,
					prodDescription: resultProductBdetail[index].prod_description,
					prodCreatedDate: moment(resultProductBdetail[index].prod_created_date).format('DD/MM/YYYY'),
					prodUpdatedDate: moment(resultProductBdetail[index].prod_updated_date).format('DD/MM/YYYY') == 'Invalid date' ? moment(resultProductBdetail[index].prod_created_date).format('DD/MM/YYYY') : moment(resultProductBdetail[index].prod_updated_date).format('DD/MM/YYYY'),
					prodPrice: resultProductBdetail[index].prod_price
				}
				let imageLink = resultProductBdetail[i].prod_img_data
				prodObj['images'] = imageLink
				prodList.push(prodObj)
			}

			checkOneDetail = false
			for(temp = 0; temp < resultOne.length; temp++){
				if(resultOne[temp].bill_id === resultProductBdetail[index].bill_id){
					checkOneDetail = true
				}
			}

			if(i!== 0 && checkOneDetail === true){
				if(count !== 2){
					let prodObj = {
						productID: resultProductBdetail[index].prod_id,
						prodName: resultProductBdetail[index].prod_name,
						prodCategory: resultProductBdetail[index].cate_name,
						prodQuantity: resultProductBdetail[index].prod_amount,
						prodDescription: resultProductBdetail[index].prod_description,
						prodCreatedDate: moment(resultProductBdetail[index].prod_created_date).format('DD/MM/YYYY'),
						prodUpdatedDate: moment(resultProductBdetail[index].prod_updated_date).format('DD/MM/YYYY') == 'Invalid date' ? moment(resultProductBdetail[index].prod_created_date).format('DD/MM/YYYY') : moment(resultProductBdetail[index].prod_updated_date).format('DD/MM/YYYY'),
						prodPrice: resultProductBdetail[index].prod_price
					}
					let imageLink = resultProductBdetail[index].prod_img_data
					prodObj['images'] = imageLink
					prodList.push(prodObj)
				}
				count++
				index = i + 1
				moveToNextBill = true
				break
			}

			if ((i >= resultProductBdetail.length - 1) || (resultProductBdetail[i + 1].bill_id != resultProductBdetail[i].bill_id)) {				
				index = i + 1
				moveToNextBill = true
				break
			}
			else {
				if (moveToNextBill == true) {
					i--
					moveToNextBill = false
				}
				else {
					index = i + 1
				}
			}

			let prodObj = {
				productID: resultProductBdetail[index].prod_id,
				prodName: resultProductBdetail[index].prod_name,
				prodCategory: resultProductBdetail[index].cate_name,
				prodQuantity: resultProductBdetail[index].prod_amount,
				prodDescription: resultProductBdetail[index].prod_description,
				prodCreatedDate: moment(resultProductBdetail[index].prod_created_date).format('DD/MM/YYYY'),
				prodUpdatedDate: moment(resultProductBdetail[index].prod_updated_date).format('DD/MM/YYYY') == 'Invalid date' ? moment(resultProductBdetail[index].prod_created_date).format('DD/MM/YYYY') : moment(resultProductBdetail[index].prod_updated_date).format('DD/MM/YYYY'),
				prodPrice: resultProductBdetail[index].prod_price
			}
			let imageLink = resultProductBdetail[index].prod_img_data
			prodObj['images'] = imageLink
			
			if (index < resultProductBdetail.length && (resultProductBdetail[index].prod_id != resultProductBdetail[index - 1].prod_id)) {
				prodList.push(prodObj)
			}
			else if (index < resultProductBdetail.length && (resultProductBdetail[index].bill_id != resultProductBdetail[index - 1].bill_id) && (resultProductBdetail[index].prod_id == resultProductBdetail[index - 1].prod_id)){
				prodList.push(prodObj)
			}
		}
		billItem['billDetailList'] = prodList
		billList.push(billItem)

	}

	return res.status(200).json({
		billList: billList,
		statusCode: successCode
	})
})

router.post('/list/:filter', billValidation.listBill,async (req, res) => {
	const { limit, page } = req.body
	const offset = limit * (page - 1)
	const { filter } = req.params

	if(!(filter === 'all' || filter === 'delivered' || filter === 'shipping')){
		return res.status(400).json({
			errorMessage: 'filter must be in 3 states(all, delivered, shipping)',
			statusCode: errorCode
		})
	}

	if (page < 1 || limit < 1 || limit > 10) {
		return res.status(400).json({
			errorMessage: "limit and page parameter is not valid",
			statusCode: errorCode
		})
	}
	if(filter === 'delivered' || filter === 'shipping'){		
		var status = 0
		if(filter === 'delivered'){
			status = 1
		}
		var resultProductBdetail = await knex.raw(`with billList as (	
			with bill as (select * from tbl_bill where bill_status = ${status}
				limit ${limit}
				offset ${offset}
			)
			select * from bill 
			left join tbl_bill_detail detail on detail.bdetail_bill_id = bill.bill_id
			left join tbl_product product on product.prod_id = detail.bdetail_product_id
			left join tbl_categories cat on cat.cate_id = product.prod_category_id
		)
		select * from billList left join tbl_product_images images on billList.bdetail_product_id = images.prod_img_product_id order by billList.bill_id`)
	
		var resultOne = await knex.raw(`with bill as (select * from tbl_bill where bill_status = ${status}
			limit ${limit}
			offset ${offset}
		)
		select bill.bill_id, count(detail.bdetail_product_id) from bill 
		left join tbl_bill_detail detail on detail.bdetail_bill_id = bill.bill_id
		left join tbl_product product on product.prod_id = detail.bdetail_product_id
		group by bill.bill_id
		having count(detail.bdetail_product_id) = 1`)
	}
	else{

		var resultProductBdetail = await knex.raw(`with billList as (	
			with bill as (select * from tbl_bill
				limit ${limit}
				offset ${offset}
			)
			select * from bill 
			left join tbl_bill_detail detail on detail.bdetail_bill_id = bill.bill_id
			left join tbl_product product on product.prod_id = detail.bdetail_product_id
			left join tbl_categories cat on cat.cate_id = product.prod_category_id
		)
		select * from billList left join tbl_product_images images on billList.bdetail_product_id = images.prod_img_product_id order by billList.bill_id`)

		var resultOne = await knex.raw(`with bill as (select * from tbl_bill
			limit ${limit}
			offset ${offset}
		)
		select bill.bill_id, count(detail.bdetail_product_id) from bill 
		left join tbl_bill_detail detail on detail.bdetail_bill_id = bill.bill_id
		left join tbl_product product on product.prod_id = detail.bdetail_product_id
		group by bill.bill_id
		having count(detail.bdetail_product_id) = 1`)
	}

	resultOne = resultOne.rows
	resultProductBdetail = resultProductBdetail.rows

	var moveToNextBill = false
	var billList = []
	var index = 0
	var checkOneDetail = false

	while (index < resultProductBdetail.length) {

		var expectedDate = new Date(resultProductBdetail[index].bill_created_date)
		expectedDate.setDate(expectedDate.getDate() + 2)

		var createdDate = moment(resultProductBdetail[index].bill_created_date).format('DD/MM/YYYY HH:mm:ss')
		expectedDate = moment(new Date(expectedDate)).format('DD/MM/YYYY HH:mm:ss')
		var status = 'shipping'

		if (resultProductBdetail[index].bill_status === 1) {
			status = 'delivered'
		}

		else if (resultProductBdetail[index].bill_status === 2) {
			status = 'cancel'
		}

		//return bill object
		var billItem = {
			billId: resultProductBdetail[index].bill_id,
			accountID: resultProductBdetail[index].bill_account_id,
			totalPrice: resultProductBdetail[index].bill_total_price,
			billQuantity: resultProductBdetail[index].bill_total_quantity,
			priceShip: resultProductBdetail[index].bill_price_ship,
			billStatus: status,
			createDate: createdDate,
			expectedDate: expectedDate,
		}

		let prodList = []
		var count = 1
		for (let i = index; i < resultProductBdetail.length; i++) {
			if (i === 0) {
				let prodObj = {
					productID: resultProductBdetail[index].prod_id,
					prodName: resultProductBdetail[index].prod_name,
					prodCategory: resultProductBdetail[index].cate_name,
					prodQuantity: resultProductBdetail[index].prod_amount,
					prodDescription: resultProductBdetail[index].prod_description,
					prodCreatedDate: moment(resultProductBdetail[index].prod_created_date).format('DD/MM/YYYY'),
					prodUpdatedDate: moment(resultProductBdetail[index].prod_updated_date).format('DD/MM/YYYY') == 'Invalid date' ? moment(resultProductBdetail[index].prod_created_date).format('DD/MM/YYYY') : moment(resultProductBdetail[index].prod_updated_date).format('DD/MM/YYYY'),
					prodPrice: resultProductBdetail[index].prod_price
				}
				let imageLink = resultProductBdetail[i].prod_img_data
				prodObj['images'] = imageLink
				prodList.push(prodObj)
			}

			checkOneDetail = false
			for(temp = 0; temp < resultOne.length; temp++){
				if(resultOne[temp].bill_id === resultProductBdetail[index].bill_id){
					checkOneDetail = true
				}
			}

			if(i!== 0 && checkOneDetail === true){
				if(count !== 2){
					let prodObj = {
						productID: resultProductBdetail[index].prod_id,
						prodName: resultProductBdetail[index].prod_name,
						prodCategory: resultProductBdetail[index].cate_name,
						prodQuantity: resultProductBdetail[index].prod_amount,
						prodDescription: resultProductBdetail[index].prod_description,
						prodCreatedDate: moment(resultProductBdetail[index].prod_created_date).format('DD/MM/YYYY'),
						prodUpdatedDate: moment(resultProductBdetail[index].prod_updated_date).format('DD/MM/YYYY') == 'Invalid date' ? moment(resultProductBdetail[index].prod_created_date).format('DD/MM/YYYY') : moment(resultProductBdetail[index].prod_updated_date).format('DD/MM/YYYY'),
						prodPrice: resultProductBdetail[index].prod_price
					}
					let imageLink = resultProductBdetail[index].prod_img_data
					prodObj['images'] = imageLink
					prodList.push(prodObj)
				}
				count++
				index = i + 1
				moveToNextBill = true
				break
			}

			if ((i >= resultProductBdetail.length - 1) || (resultProductBdetail[i + 1].bill_id != resultProductBdetail[i].bill_id)) {				
				index = i + 1
				moveToNextBill = true
				break
			}
			else {
				if (moveToNextBill == true) {
					i--
					moveToNextBill = false
				}
				else {
					index = i + 1
				}
			}

			let prodObj = {
				productID: resultProductBdetail[index].prod_id,
				prodName: resultProductBdetail[index].prod_name,
				prodCategory: resultProductBdetail[index].cate_name,
				prodQuantity: resultProductBdetail[index].prod_amount,
				prodDescription: resultProductBdetail[index].prod_description,
				prodCreatedDate: moment(resultProductBdetail[index].prod_created_date).format('DD/MM/YYYY'),
				prodUpdatedDate: moment(resultProductBdetail[index].prod_updated_date).format('DD/MM/YYYY') == 'Invalid date' ? moment(resultProductBdetail[index].prod_created_date).format('DD/MM/YYYY') : moment(resultProductBdetail[index].prod_updated_date).format('DD/MM/YYYY'),
				prodPrice: resultProductBdetail[index].prod_price
			}
			let imageLink = resultProductBdetail[index].prod_img_data
			prodObj['images'] = imageLink
			
			if (index < resultProductBdetail.length && (resultProductBdetail[index].prod_id != resultProductBdetail[index - 1].prod_id)) {
				prodList.push(prodObj)
			}
			else if (index < resultProductBdetail.length && (resultProductBdetail[index].bill_id != resultProductBdetail[index - 1].bill_id) && (resultProductBdetail[index].prod_id == resultProductBdetail[index - 1].prod_id)){
				prodList.push(prodObj)
			}
		}
		billItem['billDetailList'] = prodList
		billList.push(billItem)

	}

	return res.status(200).json({
		billList: billList,
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
		else if(proBdetail.bill_status === 3){
			status = 'cancel'
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
module.exports = router