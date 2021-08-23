const knex = require('../utils/dbConnection')

const findCityById = async (cityId) => {
	const info = await knex('tbl_cities')
					.where({ ci_id: cityId })

	return info
}

const findDistrictById = async (distId) => {
	const info = await knex('tbl_districts')
					.where({ dis_id: distId })

	return info
}

const findWardById = async (wardId) => {
	const info = await knex('tbl_wards')
					.where({ ward_id: wardId })

	return info
}

const findWardCityAndDist = async (cityId, distId) => {
	const info = await knex('tbl_wards')
					.where({ ward_city_id: cityId, ward_dis_id: distId })

	return info
}

const findDistrictByCity = async (cityId) => {
	const info = await knex('tbl_districts')
					.where({ dis_city_id: cityId })

	return info
}

const findDeliveryByAccId = async (accId) => {
	const addressInfo = await knex('tbl_delivery_address').where({ del_user_id: accId })

	const listCities = await knex('tbl_cities')
	const listDistricts = await knex('tbl_districts')
	const listWards = await knex('tbl_wards')

	const result = await Promise.all([
		addressInfo.map((item) => {
			const wardInfo = listWards.find((e) => (e.ward_id === item.del_ward_id))
			const cityInfo = listCities.find((e) => e.ci_id === wardInfo.ward_city_id)
			const districtInfo = listDistricts.find((e) => (e.dis_id === wardInfo.ward_dis_id))
			

			return {
				deliveryId: item.del_id,
				district: districtInfo.dis_name,
				ward: wardInfo.ward_name,
				city: cityInfo.ci_name,
				street: item.del_detail_address
			}
		})
	])

	return result
}

const findAllCities = async () => {
	const info = await knex('tbl_cities')

	return info
}

const findAllDistricts = async () => {
	const info = await knex('tbl_districts')

	return info
}

const findAllWards = async () => {
	const info = await knex('tbl_wards')

	return info
}

const findAllDeliveries = async () => {
	const info = await knex('tbl_delivery_address')

	return info
}

const findDeliveryById = async (delId) => {
	const info = await knex('tbl_delivery_address').where({ del_id: delId })

	return info
}

const findDeliveryByWardId = async (wardId) => {
	const info = await knex('tbl_delivery_address').where({ del_ward_id: wardId })

	return info
}

const deleteDeliveryByWardId = async (wardId) => {
	const info = await knex('tbl_delivery_address').where({ del_ward_id: wardId }).del()

	return info
}

const deleteWardByDistAndCity = async (distId, cityId) => {
	const info = await knex('tbl_wards').where({ ward_dis_id: distId, ward_city_id: cityId }).del()

	return info
}

const deleteDistrictByCity = async (cityId) => {
	const info = await knex('tbl_districts').where({ dis_city_id: cityId }).del()

	return info
}

const deleteCity = async (cityId) => {
	const info = await knex('tbl_cities').where({ ci_id: cityId }).del()

	return info
}

module.exports = {
	findCityById,
	findDistrictById,
	findDistrictByCity,
	findWardById,
	findWardCityAndDist,
	findDeliveryByAccId,
	findAllCities,
	findAllDistricts,
	findAllWards,
	findAllDeliveries,
	findDeliveryById,
	findDeliveryByWardId,
	deleteDeliveryByWardId,
	deleteWardByDistAndCity,
	deleteDistrictByCity,
	deleteCity
}
