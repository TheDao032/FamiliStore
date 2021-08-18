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
			listcities: result[0],
			statuscode: successCode
		})
	}

	return res.status(200).json({
		listcities: [],
		statuscode: errorCode
	})
})

router.post('/list-ward', async (req, res) => {
	const { cityId, districtId } = req.body
	const result = await knex.from('tbl_wards')
					.where({ ward_city_id: cityId, ward_dis_id: districtId })

	if (result) {
		return res.status(200).json({
			listcities: result,
			statuscode: successCode
		})
	}

	return res.status(200).json({
		listcities: [],
		statuscode: errorCode
	})
})

router.post('/list-districts', deliveryValidation.listDistricts, async (req, res) => {
	const { cityId } = req.body
	const result = await knex.from('tbl_districts')
						.where({ dis_city_id: cityId })

	if (result) {
		return res.status(200).json({
			listDistricts: result,
			statusCode: successCode
		})
	}

	return res.status(200).json({
		listDistricts: [],
		statusCode: errorCode
	})
})

router.post('/list-deliveries', deliveryValidation.listDeliveries, async (req, res) => {
	const { accId } = req.body
	const result = await knex.from('tbl_delivery_address')
						.join('tbl_districts', 'dis_id', 'del_district_id')
						.join('tbl_cities', 'ci_id', 'del_city_id')
						.where({ del_user_id: accId })

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


router.post('/add-city', deliveryValidation.newCity, async (req, res) => {
	const { cityName } = req.body

	const presentDate = new Date()

	const newCity = {
		ci_name: cityName,
		ci_created_date: presentDate
	}

	await knex('tbl_cities').insert(newCity)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/add-district', deliveryValidation.newDistrict, async (req, res) => {
	const { cityId, distId, distName } = req.body

	const newDistrict = {
		dis_id: distId,
		dis_name: distName, 
		dis_city_id: cityId
	}

	await knex('tbl_districts').insert(newDistrict)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/add-ward', deliveryValidation.newWard, (req, res) => {
	const { cityId, distId, wardId, wardName, wardShipPrice } = req.body

	const presentDate = new Date()

	const newWard = {
		ward_dis_id: distId, 
		ward_city_id: cityId, 
		ward_id: wardId, 
		ward_name: wardName, 
		ward_ship_price: wardShipPrice,
		ward_created_date: presentDate
	}

	knex('tbl_wards').insert(newWard)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/add-delivery', deliveryValidation.newDelivery, (req, res) => {
	const { cityId, distId, wardId, accId, delDetailAddress } = req.body

	const newDelivery = {
		del_id: distId, 
		del_city_id: cityId, 
		del_ward: wardId, 
		del_detail_address: delDetailAddress, 
		del_user_id: accId
	}

	knex('tbl_delivery_address').insert(newDelivery)

	return res.status(200).json({
		statusCode: successCode
	})
})

module.exports = router
