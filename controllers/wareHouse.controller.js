const express = require('express')
const router = express.Router()

const knex = require('../utils/dbConnection')
const wareHouseValidation = require('../middlewares/validation/wareHouse.validate')
const accountModel = require('../models/account.model')
const categoriesModel = require('../models/account.model')
const productModel = require('../models/product.model')
const wareHouseModel = require('../models/wareHouse.model')

const successCode = 0
const errorCode = 1

router.get('/list', async (req, res) => {
	const result = await knex.from('tbl_ware_house')

	if (result) {
		return res.status(200).json({
			listWareHouse: result,
			statusCode: successCode
		})
	}

	return res.status(200).json({
		listWareHouse: [],
		statusCode: errorCode
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
	
	const result = await wareHouseModel.findById(id)

	if (result) {
		return res.status(200).json({
			listWareHouse: result,
			statusCode: successCode
		})
	}

	return res.status(200).json({
		listWareHouse: [],
		statusCode: errorCode
	})
})

router.post('/add', wareHouseValidation.newWareHouse, async (req, res) => {
	const { stoAccountId, stoProductName, stoAmount, stoCategoryId, stoOriginPrice, stoProductId, cost } = req.body
    
	const account = await accountModel.findById(stoAccountId)
	const cate = await categoriesModel.findById(stoCategoryId)
	const product = await productModel.findById(stoProductId)
	
	if (account.length === 0 || cate.length === 0 || product.length === 0) {
		return res.status(400).json({
			errorMessage: 'account or product or category id not exists',
			statusCode: errorCode
		})
	}

	const presentDate = new Date()
    const wareHouse = {
        sto_account_id: stoAccountId,
        sto_product_name: stoProductName || null,
        sto_amount: stoAmount || null,
        sto_category_id: stoCategoryId,
        sto_origin_price: stoOriginPrice || null,
        sto_created_date: presentDate,
        sto_product_id: stoProductId,
        cost: cost || null
    }

	await knex('tbl_ware_house').insert(wareHouse)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/delete/:id', async (req, res) => {
	const { id } = req.params

	if(isNaN(Number(id))){
		return res.status(400).json({
			errorMessage: 'id must be of integer type',
			statusCode: errorCode
		})
	}

	const result = await knex('tbl_ware_house').where('sto_id', id).update({ sto_status: 1 })

	if (result === 0) {
		return res.status(400).json({
			errorMessage: 'id not exists',
			statusCode: errorCode
		})
	}

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/update', wareHouseValidation.updateWareHouse, async (req, res) => {
	const {stoId, stoAccountId, stoProductName, stoAmount, stoCategoryId, stoOriginPrice, stoProductId, cost } = req.body
    
	const presentDate = new Date()

	const account = await accountModel.findById(stoAccountId)
	const cate = await categoriesModel.findById(stoCategoryId)
	const product = await productModel.findById(stoProductId)
	const cwareHouse = await wareHouseModel.findById(stoId)
	
	if (account.length === 0 || cate.length === 0 || product.length === 0) {
		return res.status(400).json({
			errorMessage: 'account or product or category id not exists',
			statusCode: errorCode
		})
	}

	if (cwareHouse.length ===0) {
		return res.status(400).json({
			errorMessage: 'id ware house not exists',
			statusCode: errorCode
		})
	}
	
    const wareHouse = {
        sto_account_id: stoAccountId && stoAccountId != '' ? stoAccountId : null,
        sto_product_name: stoProductName && stoProductName != '' ? stoProductName : null,
        sto_amount: stoAmount && stoAmount != null ? stoAmount : null,
        sto_category_id: stoCategoryId && stoCategoryId != '' ? stoCategoryId : null,
        sto_origin_price: stoOriginPrice && stoOriginPrice != '' ? stoOriginPrice : null,
        sto_updated_date: presentDate,
        sto_product_id: stoProductId,
        cost: cost && cost != '' ? cost : null
    }

	await knex('tbl_ware_house').where('sto_id', stoId)
		.update(wareHouse)
	
	return res.status(200).json({
		statusCode: successCode
	})
})

module.exports = router