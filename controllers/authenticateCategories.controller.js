const express = require('express')
const moment = require('moment')

const router = express.Router()
const knex = require('../utils/dbConnection')
const categoriesValidation = require('../middlewares/validation/categories.validate')
const categoriesModel = require('../models/categories.model')
const productModel = require('../models/product.model')

const errorCode = 1
const successCode = 0

router.post('/update', categoriesValidation.updateCategory, async (req, res) => {
	const { cateId, cateName, cateFather } = req.body

	const result = await categoriesModel.findById(cateId)

	const allCategories = await categoriesModel.findAll()

	const checkExist = allCategories.find((info) => (info.cate_name.toLowerCase() === cateName.toLowerCase()) && (info.cate_id !== cateId))

	if (checkExist) {
		return res.status(400).json({
			errorMessage: 'Category Name Has Already Existed',
			statusCode: errorCode
		})
	}

	if (result.length === 0) {
		return res.status(400).json({
			errorMessage: 'Category Id Not Found',
			statusCode: errorCode
		})
	}

	const checkCateFather = cateFather && cateFather !== ''

	if (checkCateFather) {
		const fatherInfo = await categoriesModel.findById(cateFather)

		if (!fatherInfo) {
			return res.status(400).json({
				errorMessage: 'Category Father Id Not Found',
				statusCode: errorCode
			})
		}
	}

	let presentDate = new Date()
	const cateUpdate = {
		cate_name: cateName,
		cate_father: checkCateFather ? cateFather : result[0].cate_father,
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

	const listChildByCateId = await categoriesModel.findChild(cateId)

	if (listChildByCateId.length !== 0) {
		return res.status(400).json({
			errorMessage: 'Category Still Has Sub Cateogory',
			statusCode: errorCode
		})
	}

	const productsByCate = await productModel.findByCateId(cateId)

	if (productsByCate.length !== 0) {
		return res.status(400).json({
			errorMessage: 'Category Still Has Products',
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