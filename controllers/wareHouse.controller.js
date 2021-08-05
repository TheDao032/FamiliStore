const express = require('express')
const router = express.Router()
const knex = require('../utils/dbConnection')
const validation = require('../middlewares/validation')

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

	return res.status(500).json({
		listWareHouse: [],
		statusCode: errorCode
	})
})
router.get('/details/:id', async (req, res) => {
	const { id } = req.params
	const result = await knex.from('tbl_ware_house').where('sto_id', id)

	if (result) {
		return res.status(200).json({
			listWareHouse: result,
			statusCode: successCode
		})
	}

	return res.status(500).json({
		listWareHouse: [],
		statusCode: errorCode
	})
})

router.post('/add', validation.newWareHouse, async (req, res) => {
	const { stoAccountId, stoProductName, stoAmount, stoCategoryId, stoOriginPrice, stoProductId, cost } = req.body
    const account = await knex.from('tbl_account').where('acc_id', stoAccountId)
	const cate = await knex.from('tbl_categories').where('cate_id', stoCategoryId)
	const product = await knex.from('tbl_product').where('prod_id', stoProductId)
	
	if(account.length === 0 || cate.length === 0 || product.length === 0){
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
	await knex('tbl_ware_house').insert(wareHouse).catch((error) => {
		return res.status(500).json({
			errorMessage: error,
			statusCode: errorCode
		})
	})  

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/delete/:id', async (req, res) => {
	const { id } = req.params
	const result = await knex('tbl_ware_house').where('sto_id', id).del().catch((error) => {
		return res.status(500).json({
			errorMessage: error,
			statusCode: errorCode
		})
	})
	if(result === 0){
		return res.status(400).json({
			errorMessage: 'id not exists',
			statusCode: errorCode
		})
	}

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/update',validation.updateWareHouse, async (req, res) => {
	const {stoId, stoAccountId, stoProductName, stoAmount, stoCategoryId, stoOriginPrice, stoProductId, cost } = req.body
    const presentDate = new Date()
	const account = await knex.from('tbl_account').where('acc_id', stoAccountId)
	const cate = await knex.from('tbl_categories').where('cate_id', stoCategoryId)
	const product = await knex.from('tbl_product').where('prod_id', stoProductId)
	const cwareHouse = await knex.from('tbl_ware_house').where('sto_id', stoId)
	
	if(account.length === 0 || cate.length === 0 || product.length === 0){
		return res.status(400).json({
			errorMessage: 'account or product or category id not exists',
			statusCode: errorCode
		})
	}
	if(cwareHouse.length ===0 ){
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
		.catch((err) => {
		return res.status(500).json({
			errorMessage: err,
			statusCode: errorCode
		})
	})
	
	return res.status(200).json({
		statusCode: successCode
	})
})
module.exports = router