const express = require('express')
const router = express.Router()
const knex = require('../utils/dbConnection')

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

router.post('/add', async (req, res) => {
	const { stoAccountId, stoProductName, stoAmount, stoCategoryId, stoOriginPrice, stoProductId, cost } = req.body

    // const checkStoAccountId = stoAccountId && stoAccountId !== ''
	// const checkStoProductName = stoProductName && stoProductName !== ''
	// const checkStoAmount = stoAmount && stoAmount !== ''
	// const checkStoCategoryId = stoCategoryId && stoCategoryId !== ''
	// const checkStoOriginPrice = stoOriginPrice && stoOriginPrice !== ''
	// const checkStoProductId = stoProductId && stoProductId !== ''
	// const checkCost = cost && cost !== ''
    
	const presentDate = new Date()
    if(!stoAccountId || !stoCategoryId || !stoProductId){
        return res.status(400).json({
			errorMessage: 'add faill',
			code: errorCode
		})
    }

    const wareHouse = {
        sto_id: 1,
        sto_account_id: stoAccountId,
        sto_product_name: stoProductName || null,
        sto_amount: stoAmount || null,
        sto_category_id: stoCategoryId,
        sto_origin_price: stoOriginPrice || null,
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
module.exports = router