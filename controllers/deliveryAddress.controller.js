const express = require('express')

const knex = require('../utils/dbConnection')
const router = express.Router()

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

router.post('/list-districts', async (req, res) => {
	const { cityId } = req.body
	const result = await knex.from('tbl_districts')
						.where({ dis_city_id: cityId ? cityId : ''})

	if (result) {
		return res.status(200).json({
			listDisstricts: result,
			statusCode: successCode
		})
	}

	return res.status(500).json({
		listDisstricts: [],
		statusCode: errorCode
	})
})

router.post('/list-deliveries', async (req, res) => {
	const { accId } = req.body
	const result = await knex.from('tbl_delivery_address')
						.join('tbl_districts', 'dis_id', 'del_district')
						.join('tbl_cities', 'ci_id', 'del_city')
						.where({ del_user_id: accId ? accId : ''})

	if (result) {
		return res.status(200).json({
			listDisstricts: result,
			statusCode: successCode
		})
	}

	return res.status(500).json({
		listDisstricts: [],
		statusCode: errorCode
	})
})


router.post('/add-city', (req, res) => {
	const { cityId, cityName } = req.body

	if (!cityId || cityId === '' || !cityName || cityName === '') {
		return res.status(500).json({
			statusCode: errorCode
		})
	}

	knex('tbl_cities').insert({ ci_id: cityId, ci_name: cityName }).catch((err) => {
		return res.status(500).json({
			errorMessage: err,
			statusCode: errorCode
		})
	})

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/add-district', (req, res) => {
	const { cityId, distId, distName, distShipPrice } = req.body

	const checkCityId = cityId && cityId !== ''
	const checkdistId = distId && distId !== ''
	const checkdistName = distName && distName !== ''
	const checkdistShipPrice = distShipPrice ? true : false

	if (!checkCityId || !checkdistId || !checkdistName || !checkdistShipPrice) {
		return res.status(500).json({
			errorMessage: err,
			statusCode: errorCode
		})
	}

	knex('tbl_cities').insert({ dis_id: distId, dis_name: distName, dis_city_id: cityId, dis_ship_price: distShipPrice }).catch((err) => {
		return res.status(500).json({
			statusCode: errorCode
		})
	})

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/add-delivery', (req, res) => {
	const { cityId, distId, accId, delDetailAddress } = req.body

	const checkCityId = cityId && cityId !== ''
	const checkdistId = distId && distId !== ''
	const checkAccId = accId && accId !== ''
	const checkDelDetailAddress = delDetailAddress && delDetailAddress !== ''

	if (!checkCityId || !checkdistId || !checkAccId || !checkDelDetailAddress) {
		return res.status(500).json({
			errorMessage: err,
			statusCode: errorCode
		})
	}

	knex('tbl_delivery_address').insert({ del_id: distId, ddel_city: cityId, del_detail_address: delDetailAddress, del_user_id: accId }).catch((err) => {
		return res.status(500).json({
			statusCode: errorCode
		})
	})

	return res.status(200).json({
		statusCode: successCode
	})
})

