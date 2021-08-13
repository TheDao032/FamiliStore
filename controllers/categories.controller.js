const express = require('express')

const router = express.Router()
const knex = require('../utils/dbConnection')
const categoriesValidation = require('../middlewares/validation/categories.validate')
const categoriesModel = require('../models/categories.model')

const errorCode = 1
const successCode = 0

router.post('/add-father', categoriesValidation.newCategoryFather, async (req, res) => {
	const { cateName } = req.body

	const presentDate = new Date()
	const newFatherCate = {
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
	const { cateName, cateFather } = req.body

	const categoriyFatherInfo = categoriesModel.findById(cateFather)

	if (categoriyFatherInfo.length === 0) {
		return res.status(400).json({
			errorMessage: 'category Is Not Existed',
			statusCode: errorCode
		})
	}

	const presentDate = new Date()
	const newFatherCate = {
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

	const listCategories = await categoriesModel.findAll()

	const listCategoriesFather = await categoriesModel.findFather()
	
	const result = await Promise.all([
		listCategoriesFather.map((item) => {
		const listChild = listCategories.filter((info) => info.cate_father === item.cate_id)

		return {
			cateId: item.cate_id,
			cateName: item.cate_name,
			subCategories: listChild.map((itemChild) => {
				return {
					cateId: itemChild.cate_id,
					CateName: itemChild.cate_name
				}
			})
		}
	})])
	
	if (result) {
		return res.status(200).json({
			listCategories: result[0],
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
		let listCategoriesFather = []
		result.forEach((element) => {
			const categoriesInfo = {
				cateId: element.cate_id,
				cateName: element.cate_name
			}
			listCategoriesFather.push(categoriesInfo)
		});

		return res.status(200).json({
			listCategories: listCategoriesFather,
			statusCode: successCode
		})
	}

	return res.status(500).json({
		listCategories: [],
		statusCode: errorCode
	})
})

router.post('/list-child', categoriesValidation.listCategoryChild, async (req, res) => {
	const { cateFather } = req.body
	const result = await knex.from('tbl_categories')
		.where({ cate_father: cateFather })

	const fatherInfo = await categoriesModel.findById(cateFather)

	if (result) {

		let listCategoriesChild = []
		result.forEach((element) => {
			const categoriesInfo = {
				cateId: element.cate_id,
				cateName: element.cate_name
			}
			listCategoriesChild.push(categoriesInfo)
		});

		const listCategoriesFather = {
			cateId: fatherInfo[0].cate_id,
			cateName: fatherInfo[0].cate_name, 
			subCategories: listCategoriesChild
		}

		return res.status(200).json({
			listCategories: listCategoriesFather,
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
