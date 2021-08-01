const express = require('express')

const knex = require('../utils/dbConnection')
const router = express.Router()
const validation = require('../middlewares/validation')

const errorCode = 1
const successCode = 0

router.post('/list-details', validation.listBillDetail, (req, res) => {
	const { accId, billId } = req.body
	
	const result = knex('tbl_bill')
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

router.post('/add', async (req, res) => {
	const { accId, totalPrice, totalQuantity, listProductId } = req.body

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

	listProductId.forEach(async (e) => {
		const result = await knex('tbl_product').where({ prod_id: e.prodId })

		if (prodInfo.length === 0) {
			return res.status(404).json({
				errorMessage: err,
				statusCode: errorCode
			})
		}

		let prodInfo = result[0]

		const newBillDetail = {
			bdetail_bill_id: newBillId[0].bill_id,
			bdetail_product_id: e.prodId,
			bdetail_product_price: prodInfo.prod_price,
			bdetail_quantity: e.prodQuantity,
			bdetail_created_date: present,
			bdetail_updated_date: null
		}

		await knex('tbl_bill_detail').insert(newBillDetail)
	})
})

module.exports = router
