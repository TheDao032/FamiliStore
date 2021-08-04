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
    
	const presentDate = new Date()
    if(!stoAccountId || !stoCategoryId || !stoProductId){
        return res.status(400).json({
			errorMessage: 'add faill',
			code: errorCode
		})
    }

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

router.post('/delete/:id', (req, res) => {
	const { id } = req.params
	knex('tbl_ware_house').where('sto_id', id).del().catch((error) => {
		return res.status(500).json({
			errorMessage: error,
			statusCode: errorCode
		})
	})

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/update',validation.updateWareHouse, async (req, res) => {
	const {stoId, stoAccountId, stoProductName, stoAmount, stoCategoryId, stoOriginPrice, stoProductId, cost } = req.body
    const presentDate = new Date()
    const wareHouse = {
        sto_account_id: stoAccountId && stoAccountId != '' ? stoAccountId : '',
        sto_product_name: stoProductName && stoProductName != '' ? stoProductName : '',
        sto_amount: stoAmount && stoAmount != null ? stoAmount : null,
        sto_category_id: stoCategoryId && stoCategoryId != '' ? stoCategoryId : '',
        sto_origin_price: stoOriginPrice && stoOriginPrice != '' ? stoOriginPrice : '',
        sto_update_date: presentDate,
        sto_product_id: stoProductId,
        cost: cost && cost != '' ? cost : ''
    }
	await knex('tbl_ware_house').where('sto_id', stoId).update(wareHouse).catch((err) => {
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