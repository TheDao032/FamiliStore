const express = require('express')

const knex = require('../utils/dbConnection')
const router = express.Router()
const billValidation = require('../middlewares/validation/bill.validate')

const errorCode = 1
const successCode = 0

router.get('/list-details', billValidation.listBillDetail, async (req, res) => {
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
	const { accId, totalPrice, totalQuantity, listProductId } = req.body
	console.log(req.body.listProductId)
	//validate bill detail, if not valid, prevent to add bill
	var productList = await knex('tbl_product')


	let present = new Date()
	const newBill = {
		bill_account_id: accId,
		bill_total_price: totalPrice,
		bill_total_quantity: totalQuantity,
		bill_created_date: present,
		bill_updated_date: null
	}

	const newBillId = await knex('tbl_bill')
		.returning('bill_id')
		.insert(newBill)

	if (newBillId.length === 0) {
		return res.status(500).json({
			errorMessage: err,
			statusCode: errorCode
		})
	}

	listProductId.forEach(async (product) => {
		const result = await knex('tbl_product').where({ prod_id: product.prodId })

		if (prodInfo.length === 0) {
			return res.status(404).json({
				errorMessage: err,
				statusCode: errorCode
			})
		}

		let prodInfo = result[0]

		const newBillDetail = {
			bdetail_bill_id: newBillId[0].bill_id,
			bdetail_product_id: product.prodId,
			bdetail_product_price: prodInfo.prod_price,
			bdetail_quantity: product.prodQuantity,
			bdetail_created_date: present,
			bdetail_updated_date: null
		}

		await knex('tbl_bill_detail').insert(newBillDetail)
	})

})
router.get('/details/:id', async (req, res) => {
	const { id } = req.params

	const result = await knex('tbl_bill').where('bill_id', id)

	if (result.length === 0) {
		return res.status(404).json({
			Bill: [],
			statusCode: errorCode
		})
	}

	return res.status(200).json({
		Bill: result[0],
		statusCode: successCode
	})
})

router.get('/history-bill/:id', async (req, res) => {
	const { id } = req.params

	const result = await knex('tbl_bill').where('bill_account_id', id)

	if (result.length === 0) {
		return res.status(404).json({
			ListBill: [],
			statusCode: errorCode
		})
	}

	return res.status(200).json({
		ListBill: result,
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
			message: "limit and page parameter is not valid",
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
		return res.status(500).json({
			listProduct: [],
			statusCode: errorCode
		})
	}
})
module.exports = router
