const express = require('express')

const router = express.Router()
const knex = require('../utils/dbConnection')
const categoriesValidation = require('../middlewares/validation/categories.validate')

const errorCode = 1
const successCode = 0

router.post('/add-father', categoriesValidation.newCategoryFather, (req, res) => {
	const { cateId, cateName } = req.body
	knex('tbl_categories').insert({ cate_id: cateId, cate_name: cateName })
})

router.post('/add-child', categoriesValidation.newCategoryChild, (req, res) => {
	const { cateId, cateName, cateFather } = req.body
	knex('tbl_categories').insert({ cate_id: cateId, cate_name: cateName, cate_father: cateFather })
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

router.get('/list-father', async (req, res) => {
	const result = await knex.from('tbl_categories')
		.where({ cate_status: 0, cate_father: null})

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

router.get('/list-child', categoriesValidation.listCategoryChild, async (req, res) => {
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

router.post('/update', categoriesValidation.newCategoryChild, async (req, res) => {
	const { cateId, cateName, cateFather } = req.body
	await knex('tbl_categories')
		.where({ cate_id: cateId })
		.update({ cate_name: `${cateName && cateName != '' ? cateName : ''}`, cate_father: `${cateFather && cateFather != '' ? cateFather : ''}`})
	
	return res.status(200).json({
		statusCode: successCode
	})
})

module.exports = router
