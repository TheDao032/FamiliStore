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

	const { page, limit } = req.query

	const allCategories = await categoriesModel.findAll()
	const listCategoriesFather = await categoriesModel.findFather()
	
	const result = await Promise.all([
		listCategoriesFather.map((item) => {
			let fatherInfo
			let listChild

			if (item.cate_father === null) {
				const index = listCategoriesFather.indexOf(item)
				if (index > -1) {
					listCategoriesFather.splice(index, 1)
				}

				let checkExist = listCategoriesFather.find((info) => info.cate_id === item.cate_id)

				if (!checkExist) {
					fatherInfo = allCategories.find((info) => info.cate_id === item.cate_id)

					return {
						cateId: fatherInfo.cate_id,
						cateName: fatherInfo.cate_name,
						subCategories: {}
					}
				} else {
					return null
				}
				
			}

			fatherInfo = allCategories.find((info) => info.cate_id === item.cate_father)
			listChild = allCategories.filter((info) => info.cate_father === item.cate_father)
			
			return {
				cateId: fatherInfo.cate_id,
				cateName: fatherInfo.cate_name,
				subCategories: listChild.map((itemChild) => {
						return {
							cateId: itemChild.cate_id,
							CateName: itemChild.cate_name
						}
				})
			}
		}).filter((result) => result !== null)
	])
	
	if (result) {
		if (page || limit) {
			let paginationResult = {}
			let startIndex = (parseInt(page) - 1) * parseInt(limit)
			let endIndex = (parseInt(page) * parseInt(limit))

			if (endIndex < result[0].length) {
				paginationResult.next = {
					page: parseInt(page) + 1,
					limit: parseInt(limit)
				}
			}
	
			if (startIndex > 0) {
				paginationResult.previous = {
					page: parseInt(page) - 1,
					limit: parseInt(limit)
				}
			}
	
			paginationResult.listCategories = result[0].slice(startIndex, endIndex)
	
			return res.status(200).json({
				paginationResult,
				statusCode: successCode
			})
		}
		
		return res.status(200).json({
			paginationResult: result[0],
			statusCode: successCode
		})
	}

	return res.status(200).json({
		paginationResult: {},
		statusCode: errorCode
	})
})

router.get('/list-father', async (req, res) => {
	const { page, limit } = req.query

	const allCategories = await categoriesModel.findAll()
	const listCategoriesFather = await categoriesModel.findFather()

	const result = await Promise.all([
		listCategoriesFather.map((element) => {
			let fatherInfo
			if (element.cate_father === null) {
				const index = listCategoriesFather.indexOf(element)
				if (index > -1) {
					listCategoriesFather.splice(index, 1)
				}

				let checkExist = listCategoriesFather.find((info) => info.cate_id === element.cate_id)

				if (!checkExist) {
					fatherInfo = allCategories.find((info) => info.cate_id === element.cate_id)

					return {
						cateId: fatherInfo.cate_id,
						cateName: fatherInfo.cate_name,
					}
				} else {
					return null
				}
			}
			fatherInfo = allCategories.find((info) => info.cate_id === element.cate_father)

			return {
				cateId: fatherInfo.cate_id,
				cateName: fatherInfo.cate_name
			}
		}).filter((result) => {
			return result !== null
		})
	])
	
	if (result) {
		if (page || limit) {
			let paginationResult = {}
			let startIndex = (parseInt(page) - 1) * parseInt(limit)
			let endIndex = (parseInt(page) * parseInt(limit))
	
			if (endIndex < result[0].length) {
				paginationResult.next = {
					page: parseInt(page) + 1,
					limit: parseInt(limit)
				}
			}
	
			if (startIndex > 0) {
				paginationResult.previous = {
					page: parseInt(page) - 1,
					limit: parseInt(limit)
				}
			}
	
			paginationResult.listCategories = result[0].slice(startIndex, endIndex)
	
			return res.status(200).json({
				paginationResult,
				statusCode: successCode
			})
		}
		return res.status(200).json({
			paginationResult: result[0],
			statusCode: successCode
		})
	}

	return res.status(200).json({
		paginationResult: {},
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

	return res.status(200).json({
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
		cate_father: cateFather && cateFather !== '' ? cateFather : null,
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

	await knex('tbl_categories')
		.where({ cate_father: cateId })
		.del()

	return res.status(200).json({
		statusCode: successCode
	})
})

module.exports = router
