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

router.get('/list-districts', async (req, res) => {
	const result = await knex.from('tbl_districts')

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
