const express = require('express')
const router = express.Router()
const knex = require('../utils/dbConnection')

const successCode = 0
const errorCode = 1

router.get('/list', async (req, res) => {
	const result = await knex.from('account')

	if (result) {
		return res.status(200).json({
			listActors: result,
			statusCode: successCode
		})
	}

	return res.status(500).json({
		listActors: [],
		statusCode: errorCode
	})
})

router.get('/details/:id', async (req, res) => {
	const { id } = req.params
	const result = await knex.from('account').where('account_id', id)

	if (result) {
		return res.status(200).json({
			listActors: result,
			statusCode: successCode
		})
	}

	return res.status(500).json({ listActors: [],
		statusCode: errorCode
	})
})

router.post('/add', (req, res) => {
	const { firstName, lastName } = req.body
	knex('account').insert({}).catch((error) => {
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
	knex('account').where('account_id', id).del().catch((error) => {
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
