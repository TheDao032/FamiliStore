const express = require('express')

const knex = require('../utils/dbConnection')
const router = express.Router()
const deliveryValidation = require('../middlewares/validation/delivery.validate')
const deliveryModel = require('../models/delivery.model')

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
	const allCities = await deliveryModel.findAllCities()

	const checkExist = allCities.find((item) => item.ci_name.toLowerCase() === cityName.toLowerCase())

	if (checkExist) {
		return res.status(400).json({
			errorMessage: `City's Name Is Already Exist`,
			statusCode: errorCode
		})
	}

	const newCity = {
		ci_name: cityName,
		ci_created_date: presentDate
	}

	const returnInfo = await knex('tbl_cities').insert(newCity).returning('ci_id')

	return res.status(200).json({
		cityId: returnInfo[0],
		statusCode: successCode
	})
})

router.post('/update-city', deliveryValidation.updateCity, async (req, res) => {
	const { cityId, cityName } = req.body

	const presentDate = new Date()
	const allCities = await deliveryModel.findAllCities()
	const cityInfo = await deliveryModel.findCityById(cityId)

	const checkCityName = cityName && cityName !== '' ? true : false

	if (checkCityName) {
		const checkExist = allCities.find((item) => (item.ci_name.toLowerCase() === cityName.toLowerCase()) && (item.ci_id  !== cityId))

		if (checkExist) {
			return res.status(400).json({
				errorMessage: `City's Name Is Already Exist`,
				statusCode: errorCode
			})
		}
	}


	const updateCity = {
		ci_name: checkCityName ? cityName : cityInfo[0].ci_name,
		ci_created_date: presentDate
	}

	await knex('tbl_cities').update(updateCity).where({ ci_id: cityId })

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/add-district', deliveryValidation.newDistrict, async (req, res) => {
	const { cityId, distName } = req.body

	const checkCities = await deliveryModel.findCityById(cityId)
	const allDistricts = await deliveryModel.findAllDistricts()

	if (checkCities.length === 0) {
		return res.status(400).json({
			errorMessage: `City's Id Is Invalid`,
			statusCode: errorCode
		})
	}

	const checkExist = allDistricts.find((item) => item.dis_name.toLowerCase() === distName.toLowerCase())

	if (checkExist) {
		return res.status(400).json({
			errorMessage: `District's Name Is Already Exist`,
			statusCode: errorCode
		})
	}

	const newDistrict = {
		dis_name: distName, 
		dis_city_id: cityId
	}

	const returnInfo = await knex('tbl_districts').insert(newDistrict).returning('dis_id')

	return res.status(200).json({
		distId: returnInfo[0],
		statusCode: successCode
	})
})

router.post('/update-district', deliveryValidation.updateDistrict, async (req, res) => {
	const { cityId, distId, distName } = req.body

	let cityInfo = null
	const allDistricts = await deliveryModel.findAllDistricts()
	const districtInfo = await deliveryModel.findDistrictById(distId)

	const checkCityId = cityId && cityId !== '' ? true : false

	if (checkCityId) {
		cityInfo = await deliveryModel.findCityById(cityId)

		if (cityInfo.length === 0) {
			return res.status(400).json({
				errorMessage: `City's Id Is Invalid`,
				statusCode: errorCode
			})
		}
	}

	const checkDistrictName = distName && distName !== '' ? true : false

	if (checkDistrictName) {
		const checkExist = allDistricts.find((item) => (item.dis_name.toLowerCase() === distName.toLowerCase) && (item.dis_id !== districtInfo[0].dis_id))

		if (checkExist) {
			return res.status(400).json({
				errorMessage: `District's Name Is Already Exist`,
				statusCode: errorCode
			})
		}
	}



	const updateDistrict = {
		dis_name: checkDistrictName ? distName : districtInfo[0].dis_name,
		dis_city_id: checkCityId ? cityId : districtInfo[0].dis_city_id
	}

	await knex('tbl_districts').update(updateDistrict).where({ dis_id: distId })

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/add-ward', deliveryValidation.newWard, async (req, res) => {
	const { distId, wardName, wardShipPrice } = req.body

	const presentDate = new Date()
	const checkDistricts = await deliveryModel.findDistrictById(distId)
	const allWards = await deliveryModel.findAllWards()

	if (checkDistricts.length === 0) {
		return res.status(400).json({
			errorMessage: `District's Id Is Invalid`,
			statusCode: errorCode
		})
	}

	const checkExist = allWards.find((item) => item.ward_name.toLowerCase() === wardName.toLowerCase())

	if (checkExist) {
		return res.status(400).json({
			errorMessage: `Ward's Name Is Already Exist`,
			statusCode: errorCode
		})
	}

	const newWard = {
		ward_dis_id: checkDistricts[0].dis_id, 
		ward_city_id: checkDistricts[0].dis_city_id, 
		ward_name: wardName, 
		ward_ship_price: wardShipPrice,
		ward_created_date: presentDate
	}

	const returnInfo = await knex('tbl_wards').insert(newWard).returning('ward_id')

	return res.status(200).json({
		wardId: returnInfo[0],
		statusCode: successCode
	})
})

router.post('/update-ward', deliveryValidation.updateWard, async (req, res) => {
	const { distId, wardId, wardName, wardShipPrice } = req.body

	const presentDate = new Date()
	const allWards = await deliveryModel.findAllWards()
	const wardInfo = await deliveryModel.findWardById(wardId)

	const checkWardName = wardName && wardName !== '' ? true : false
	if (checkWardName) {
		const checkExist = allWards.find((item) => (item.ward_name.toLowerCase() === wardName.toLowerCase()) && (item.ward_id !== wardId))

		if (checkExist) {
			return res.status(400).json({
				errorMessage: `Ward's Name Is Already Exist`,
				statusCode: errorCode
			})
		}
	}


	const checkDistricts = distId ? true : false
	let districtInfo = null
	if (checkDistricts)	{
		districtInfo = await deliveryModel.findDistrictById(distId)

		if (districtInfo.length === 0) {
			return res.status(400).json({
				errorMessage: `District's Id Is Invalid`,
				statusCode: errorCode
			})
		}
	}


	const updateWard = {
		ward_dis_id: checkDistricts ? districtInfo[0].dis_id : wardInfo[0].ward_dis_id,
		ward_city_id: checkDistricts ? districtInfo[0].dis_city_id : wardInfo[0].ward_city_id, 
		ward_name: checkWardName ? wardName : wardInfo[0].ward_name, 
		ward_ship_price: wardShipPrice ? wardShipPrice : wardInfo[0].ward_ship_price,
		ward_updated_date: presentDate
	}

	await knex('tbl_wards').update(updateWard).where({ ward_id: wardId })

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/add-delivery', deliveryValidation.newDelivery, async (req, res) => {
	const { wardId, delDetailAddress } = req.body
	const { accId } = req.account

	const checkWards = await deliveryModel.findWardById(wardId)
	const allDeliveries = await deliveryModel.findAllDeliveries()

	const checkDelivery = allDeliveries.find((item) => item.del_detail_address.toLowerCase() === delDetailAddress.toLowerCase())

	if (checkDelivery) {
		return res.status(400).json({
			errorMessage: 'Detail Address Has Already Existed',
			statusCode: errorCode
		})
	}

	if (checkWards.length === 0) {
		return res.status(400).json({
			errorMessage: `Ward's Id Is Invalid`,
			statusCode: errorCode
		})
	}

	const newDelivery = {
		del_city_id: checkWards[0].ward_city_id,
		del_district_id: checkWards[0].ward_dis_id,
		del_ward_id: wardId, 
		del_detail_address: delDetailAddress, 
		del_user_id: accId
	}

	const returnInfo = await knex('tbl_delivery_address').insert(newDelivery).returning('del_id')

	return res.status(200).json({
		delId: returnInfo[0],
		statusCode: successCode
	})
})

router.post('/update-delivery', deliveryValidation.newDelivery, async (req, res) => {
	const { delId, wardId, delDetailAddress } = req.body
	const { accId } = req.account

	const deliveryInfo = await deliveryModel.findDeliveryById(delId)

	if (wardId) {
		const checkWards = await deliveryModel.findWardById(wardId)
		if (checkWards.length === 0) {
			return res.status(400).json({
				errorMessage: `City's Id Is Invalid`,
				statusCode: errorCode
			})
		}
	}

	if (delDetailAddress) {
		const allDeliveries = await deliveryModel.findAllDeliveries()
		const checkDelivery = allDeliveries.find((item) => (item.del_detail_address.toLowerCase() === delDetailAddress.toLowerCase()) && (item.del_id !== delId))

		if (checkDelivery) {
			return res.status(400).json({
				errorMessage: 'Detail Address Has Already Existed',
				statusCode: errorCode
			})
		}
	}

	const newDelivery = {
		del_ward_id: wardId ? wardId : deliveryInfo[0].del_ward_id, 
		del_detail_address: delDetailAddress ? delDetailAddress : deliveryInfo[0].del_detail_address, 
		del_user_id: accId
	}

	await knex('tbl_delivery_address').update(newDelivery).where({ del_id: delId })

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/delete-delivery', deliveryValidation.deleteDelivery, async (req, res) => {
	const { delId } = req.body

	const deliveryInfo = await deliveryModel.findDeliveryById(delId)

	if (deliveryInfo.length === 0) {
		return res.status(400).json({
			errorMessage: `Delivery's Id Is Invalid`,
			statusCode: errorCode
		})
	}

	await knex('tbl_delivery_address').where({ del_id: delId }).del()

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/delete-city', deliveryValidation.deleteCity, async (req, res) => {
	const { cityId } = req.body
	
	const cityInfo = await deliveryModel.findCityById(cityId)
	const districtsInfo = await deliveryModel.findDistrictByCity(cityId)

	if (cityInfo.length === 0) {
		return res.status(400).json({
			errorMessage: `City's Id Is Invalid`,
			statusCode: errorCode
		})
	}

	if (districtsInfo.length !== 0) {
		return res.status(400).json({
			errorMessage: `District Is Dependent On This City`,
			statusCode: errorCode
		})
	}

	knex('tbl_cities').where({ ci_id: cityId }).del()

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/delete-ward', deliveryValidation.deleteWard, async (req, res) => {
	const { wardId } = req.body

	const wardInfo = await deliveryModel.findWardById(wardId)
	const deliveryInfo = await deliveryModel.findDeliveryByWardId(wardId)

	if (wardInfo.length === 0) {
		return res.status(400).json({
			errorMessage: `Ward's Id Is Invalid`,
			statusCode: errorCode
		})
	}

	if (deliveryInfo.length !== 0) {
		return res.status(400).json({
			errorMessage: `Delivery Is Dependent On This Ward`,
			statusCode: errorCode
		})
	}

	await knex('tbl_wards').where({ ward_id: wardId }).del()

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/delete-district', deliveryValidation.deleteDistrict, async (req, res) => {
	const { distId } = req.body

	const districtInfo = await deliveryModel.findDistrictById(distId)
	

	if (districtInfo.length === 0) {
		return res.status(400).json({
			errorMessage: `District's Id Is Invalid`,
			statusCode: errorCode
		})
	}
	
	const wardInfo = await deliveryModel.findWardCityAndDist(districtInfo[0].dis_id, districtInfo[0].dis_city_id)

	if (wardInfo.length !== 0) {
		return res.status(400).json({
			errorMessage: 'Ward Is Dependent On This District',
			statusCode: errorCode
		})
	}

	await knex('tbl_districts').where({ dis_id: distId }).del()

	return res.status(200).json({
		statusCode: successCode
	})
})

module.exports = router
