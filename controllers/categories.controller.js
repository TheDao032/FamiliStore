const express = require('express')

const router = express.Router()
const knex = require('../utils/dbConnection')
const categoriesValidation = require('../middlewares/validation/categories.validate')
const categoriesModel = require('../models/categories.model')

const errorCode = 1
const successCode = 0

router.post('/add-father', categoriesValidation.newCategoryFather, async (req, res) => {
	const { cateId, cateName } = req.body

	const presentDate = new Date()
	const newFatherCate = {
		cate_id: cateId, 
		cate_name: cateName,
		cate_created_date: presentDate,
		cate_updated_date: presentDate
	}

	await knex('tbl_categories').insert(newFatherCate)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/add-child', categoriesValidation.newCategoryChild, async (req, res) => {
	const { cateId, cateName, cateFather } = req.body

	const presentDate = new Date()
	const newFatherCate = {
		cate_id: cateId, 
		cate_name: cateName,
		cate_father: cateFather,
		cate_created_date: presentDate,
		cate_updated_date: presentDate
	}

	await knex('tbl_categories').insert(newFatherCate)
	
	return res.status(200).json({
		statusCode: successCode
	})
})

router.get('/list', async (req, res) => {
	const result = await knex.from('tbl_categories')
		.where({ cate_status: 0})

	let fullCategories = []

	const listCategoriesFather = await categoriesModel.findFather()

	listCategoriesFather.forEach(async (element) => {
		const listCategoriesChild = await categoriesModel.findChild(element.cate_id)

		let listChild = []

		listCategoriesChild.forEach((element) => {
			let childInfo = {
				cateId: element.cate_id,
				cateName: element.cate_name
			}

			listChild.push(childInfo)
		});

		let fatherInfo = {
			cateId: element.cate_id,
			cateName: element.cate_name,
			subCategories: listChild,
		}

		fullCategories.push(fatherInfo)
	})

	if (fullCategories.length !== 0) {
		return res.status(200).json({
			listCategories: fullCategories,
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
		.where({ cate_father: null})

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
		.where({ cate_father: cateFather })

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

router.post('/update', categoriesValidation.updateCategory, async (req, res) => {
	const { cateId, cateName, cateFather } = req.body

	const result = await categoriesModel.findById(cateId)

	if (result.length === 0) {
		res.status(400).json({
			errorMessage: 'Category Id Not Found',
			statusCode: errorCode
		})
	}

	let presentDate = new Date()
	const cateUpdate = {
		cate_name: cateName,
		cate_father: cateFather,
		cate_updated_date: presentDate
	}

	await knex('tbl_categories')
		.where({ cate_id: cateId })
		.update(cateUpdate)
	
	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/delete', categoriesValidation.deleteCategory, async (req, res) => {
	const { cateId } = req.body

	const result = await categoriesModel.findById(cateId)

	if (result.length === 0) {
		res.status(400).json({
			errorMessage: 'Catetegory Is Not Found',
			statusCode: errorCode
		})
	}

	await knex('tbl_categories')
		.where({ cate_id: cateId })
		.del()

	return res.status(200).json({
		statusCode: successCode
	})
})

module.exports = router
