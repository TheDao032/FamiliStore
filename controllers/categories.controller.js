const express = require('express')
const moment = require('moment')

const router = express.Router()
const knex = require('../utils/dbConnection')
const categoriesValidation = require('../middlewares/validation/categories.validate')
const categoriesModel = require('../models/categories.model')
const productModel = require('../models/product.model')

const errorCode = 1
const successCode = 0

router.post('/add-father', categoriesValidation.newCategoryFather, async (req, res) => {
	const { cateName } = req.body

	const allCategories = await categoriesModel.findAll()

	const checkExist = allCategories.find((item) => item.cate_name.toLowerCase() === cateName.toLowerCase())

	if (checkExist) {
		return res.status(400).json({
			errorMessage: 'Category Name Has Already Existed',
			statusCode: errorCode
		})
	}

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

	const allCategories = await categoriesModel.findAll()

	const checkExist = allCategories.find((item) => item.cate_name.toLowerCase() === cateName.toLowerCase())

	if (checkExist) {
		return res.status(400).json({
			errorMessage: 'Category Name Has Already Existed',
			statusCode: errorCode
		})
	}

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
	const listCategoriesFatherWithoutChild = await categoriesModel.findAllFather()

	const filterList = listCategoriesFatherWithoutChild.filter((info) => {
		const checkExist = listCategoriesFather.find((item) => item.cate_father === info.cate_id)
		if (checkExist) {
			return false
		}

		return true
	})

	
	const result = await Promise.all([
		listCategoriesFather.map((item) => {
			const fatherInfo = allCategories.find((info) => info.cate_id === item.cate_father)
			const listChild = allCategories.filter((info) => info.cate_father === item.cate_father)
			
			return {
				cateId: fatherInfo.cate_id,
				cateName: fatherInfo.cate_name,
				subCategories: listChild.map((itemChild) => {
					const createDate = moment(new Date(itemChild.cate_created_date)).format("DD-MM-YYYY")					

					return {
						cateId: itemChild.cate_id,
						cateName: itemChild.cate_name,
						createDate
					}
				})
			}
		}),
		filterList.map((item) => {
			const fatherInfo = allCategories.find((info) => info.cate_id === item.cate_id)
			const listChild = allCategories.filter((info) => info.cate_father === item.cate_id)
			
			return {
				cateId: fatherInfo.cate_id,
				cateName: fatherInfo.cate_name,
				subCategories: listChild.map((itemChild) => {
					const createDate = moment(new Date(itemChild.cate_created_date)).format("DD-MM-YYYY")

					return {
						cateId: itemChild.cate_id,
						cateName: itemChild.cate_name,
						createDate
					}
				})
			}
		})
	])
	
	if (result) {
		result[1].forEach((item) => {
			result[0].push(item)
		})

		result[0].sort((a, b) => a - b)

		if (page || limit) {
			let startIndex = (parseInt(page) - 1) * parseInt(limit)
			let endIndex = (parseInt(page) * parseInt(limit))
			let totalPage = Math.floor(result[0].length / parseInt(limit))

			if (result[0].length % parseInt(limit) !== 0) {
				totalPage = totalPage + 1
			}
	
			const paginationResult = result[0].slice(startIndex, endIndex)
	
			return res.status(200).json({
				totalPage,
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
	const listCategoriesFatherWithChild = await categoriesModel.findFather()

	const listCategoriesFatherWithoutChild = await categoriesModel.findAllFather()

	const filterList = listCategoriesFatherWithoutChild.filter((info) => {
		const checkExist = listCategoriesFatherWithChild.find((item) => item.cate_father === info.cate_id)
		if (checkExist) {
			return false
		}

		return true
	})

	const result = await Promise.all([
		listCategoriesFatherWithChild.map((element) => {
			const fatherInfo = allCategories.find((info) => info.cate_id === element.cate_father)
			const createDate = moment(new Date(fatherInfo.cate_created_date)).format("DD-MM-YYYY")

			return {
				cateId: fatherInfo.cate_id,
				cateName: fatherInfo.cate_name,
				createDate
			}
		}),
		filterList.map((element) => {
			const fatherInfo = allCategories.find((info) => info.cate_id === element.cate_id)
			const createDate = moment(new Date(fatherInfo.cate_created_date)).format("DD-MM-YYYY")

			return {
				cateId: fatherInfo.cate_id,
				cateName: fatherInfo.cate_name,
				createDate
			}
		})
	])
	
	if (result) {
		result[1].forEach((item) => {
			result[0].push(item)
		})

		result[0].sort((a, b) => a - b)

		if (page || limit) {
			let startIndex = (parseInt(page) - 1) * parseInt(limit)
			let endIndex = (parseInt(page) * parseInt(limit))
			let totalPage = Math.floor(result[0].length / parseInt(limit))

			if (result[0].length % parseInt(limit) !== 0) {
				totalPage = totalPage + 1
			}
	
			const paginationResult = result[0].slice(startIndex, endIndex)
	
			return res.status(200).json({
				totalPage,
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
	const { page, limit } = req.query
	const { cateFather } = req.body

	const result = await knex.from('tbl_categories')
		.where({ cate_father: cateFather })

	const fatherInfo = await categoriesModel.findById(cateFather)
	
	if (!fatherInfo) {
		return res.status(400).json({
			errorMessage: 'Category Father Does Not Exist',
			statusCode: errorCode
		})
	}

	if (result.length !== 0) {
		let listCategoriesChild = []
		result.forEach((element) => {
			const categoriesInfo = {
				cateId: element.cate_id,
				cateName: element.cate_name,
				createDate: element.cate_created_date
			}
			listCategoriesChild.push(categoriesInfo)
		});

		if (page || limit) {
			let startIndex = (parseInt(page) - 1) * parseInt(limit)
			let endIndex = (parseInt(page) * parseInt(limit))
			let totalPage = Math.floor(listCategoriesChild.length / parseInt(limit))

			if (listCategoriesChild.length % parseInt(limit) !== 0) {
				totalPage = totalPage + 1
			}

			listCategoriesChild.sort((a, b) => a -b)
	
			const paginationResult = listCategoriesChild.slice(startIndex, endIndex)
	
			return res.status(200).json({
				cateId: fatherInfo[0].cate_id,
				cateName: fatherInfo[0].cate_name,
				createDate: fatherInfo[0].cate_created_date,
				totalPage,
				subCategories: paginationResult,
				statusCode: successCode
			})
		}

		return res.status(200).json({
			cateId: fatherInfo[0].cate_id,
			cateName: fatherInfo[0].cate_name,
			createDate: fatherInfo[0].cate_created_date,
			subCategories: listCategoriesChild,
			statusCode: successCode
		})
	}

	return res.status(200).json({
		cateId: fatherInfo[0].cate_id,
		cateName: fatherInfo[0].cate_name,
		createDate: fatherInfo[0].cate_created_date,
		subCategories: [],
		statusCode: errorCode
	})
})

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
