const express = require('express')

const knex = require('../utils/dbConnection')
const router = express.Router()
const deliveryValidation = require('../middlewares/validation/delivery.validate')

const errorCode = 1
const successCode = 0

router.get('/list-cities', async (req, res) => {
	const result = await knex.from('tbl_cities')

	if (result) {
		return res.status(200).json({
			listCities: result,
			statusCode: successCode
		})
	}

	return res.status(500).json({
		listCities: [],
		statusCode: errorCode
	})
})

router.post('/list-districts', deliveryValidation.listDistricts, async (req, res) => {
	const { cityId } = req.body
	const result = await knex.from('tbl_districts')
						.where({ dis_city_id: cityId ? cityId : ''})

	if (result) {
		return res.status(200).json({
			listDistricts: result,
			statusCode: successCode
		})
	}

	return res.status(500).json({
		listDistricts: [],
		statusCode: errorCode
	})
})

router.post('/list-deliveries', deliveryValidation.listDeliveries, async (req, res) => {
	const { accId } = req.body
	const result = await knex.from('tbl_delivery_address')
						.join('tbl_districts', 'dis_id', 'del_district')
						.join('tbl_cities', 'ci_id', 'del_city')
						.where({ del_user_id: accId ? accId : ''})

	if (result) {
		return res.status(200).json({
			listDeliveries: result,
			statusCode: successCode
		})
	}

	return res.status(500).json({
		listDeliveries: [],
		statusCode: errorCode
	})
})


router.post('/add-city', deliveryValidation.newCity, (req, res) => {
	const { cityId, cityName } = req.body

	knex('tbl_cities').insert({ ci_id: cityId, ci_name: cityName })

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/add-district', deliveryValidation.newDistrict, (req, res) => {
	const { cityId, distId, distName, distShipPrice } = req.body

	knex('tbl_districts').insert({ dis_id: distId, dis_name: distName, dis_city_id: cityId, dis_ship_price: distShipPrice })

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/add-delivery', deliveryValidation.newDelivery, (req, res) => {
	const { cityId, distId, accId, delDetailAddress } = req.body

	knex('tbl_delivery_address').insert({ del_id: distId, ddel_city: cityId, del_detail_address: delDetailAddress, del_user_id: accId })

	return res.status(200).json({
		statusCode: successCode
	})
})

module.exports = router
