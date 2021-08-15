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
			const cityInfo = listCities.find((e) => e.ci_id === item.del_city_id)
			const districtInfo = listDistricts.find((e) => (e.dis_id === item.del_district_id) && (e.dis_city_id === cityInfo.ci_id))
			const wardInfo = listWards.find((e) => (e.ward_id === item.del_ward) && (e.ward_dis_id === districtInfo.dis_id) && (e.ward_city_id === cityInfo.ci_id))

			return {
				deliveryId: item.del_id,
				district: districtInfo.dis_name,
				wardInfo: wardInfo.ward_name,
				street: item.del_detail_address
			}
		})
	])

	return result
}

module.exports = {
	findCityById,
	findDistrictById,
	findDistrictByCity,
	findWardById,
	findWardCityAndDist,
	findDeliveryByAccId
}
