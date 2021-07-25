const express = require('express')

const router = express.Router()
const knex = require('../utils/dbConnection')

const errorCode = 1
const successCode = 0

router.post('/add-father', (req, res) => {
	const { cateId, cateName } = req.body
	knex('tbl_categories').insert({ cate_id: cateId, cate_name: cateName }).catch((error) => {
		return res.status(500).json({
			errorMessage: error,
			statusCode: errorCode
		})
	})
})

router.post('/add-child', (req, res) => {
	const { cateId, cateName, cateFather } = req.body
	knex('tbl_categories').insert({ cate_id: cateId, cate_name: cateName, cate_father: cateFather }).catch((error) => {
		return res.status(500).json({
			errorMessage: error,
			statusCode: errorCode
		})
	})
})

router.get('/list', async (req, res) => {
	const result = await knex.from('tbl_categories')
		.where({ cate_status: 0})

	if (result) {
		return res.status(200).json({
			listCategories: result,
			statusCode: successCode
		})
	}

	return res.status(500).json({
		listCategories: [],
		statusCode: errorCode
	})
})

router.get('/list-child', async (req, res) => {
	const { cateFather } = req.body
	const result = await knex.from('tbl_categories')
		.where({ cate_father: cateFather, cate_status: 0})

	if (result) {
		return res.status(200).json({
			listCategories: result,
			statusCode: successCode
		})
	}

	return res.status(500).json({
		listCategories: [],
		statusCode: errorCode
	})
})

router.post('/update', async (req, res) => {
	const { cateId, cateName, cateFather } = req.body
	await knex('tbl_categories')
		.where({ cate_id: cateId })
		.update({ cate_name: `${cateName && cateName != '' ? cateName : ''}`, cate_father: `${cateFather && cateFather != '' ? cateFather : ''}`})
	.catch((err) => {
		return res.status(500).json({
			errorMessage: err,
			code: errorCode
		})
	})
	
	return res.status(200).json({
		code: successCode
	})
})

module.exports = router
