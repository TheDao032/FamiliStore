const express = require('express')
const moment = require('moment')

const router = express.Router()
const knex = require('../utils/dbConnection')
const categoriesValidation = require('../middlewares/validation/categories.validate')
const categoriesModel = require('../models/categories.model')
const productModel = require('../models/product.model')
const productImageModel = require('../models/productImage.model')

const errorCode = 1
const successCode = 0

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

	const fatherInfo = await categoriesModel.findById(cateFather)
	
	
	if (fatherInfo.length === 0) {
		return res.status(400).json({
			errorMessage: 'Category Father Does Not Exist',
			statusCode: errorCode
		})
	}

	const result = await knex.from('tbl_categories')
		.where({ cate_father: cateFather })

	const fatherCreateDate = moment(new Date(fatherInfo[0].cate_created_date)).format("DD-MM-YYYY")

	if (result.length !== 0) {
		let listCategoriesChild = []
		result.forEach((element) => {
			const childCreateDate = moment(new Date(element.cate_created_date)).format("DD-MM-YYYY")
			const categoriesInfo = {
				cateId: element.cate_id,
				cateName: element.cate_name,
				createDate: childCreateDate
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
				createDate: fatherCreateDate,
				totalPage,
				subCategories: paginationResult,
				statusCode: successCode
			})
		}

		return res.status(200).json({
			cateId: fatherInfo[0].cate_id,
			cateName: fatherInfo[0].cate_name,
			createDate: fatherCreateDate,
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

router.get('/product-with-cate', categoriesValidation.listSubCategory, async (req, res) => {

	const fathersInfo = await categoriesModel.findFatherWithLimit()
	const listCategories = await categoriesModel.findAll()
	const listProducts = await productModel.findAll()
	const listProductImages = await productImageModel.findAll()

	if (fathersInfo.length !== 0) {
		const childResult = fathersInfo.map((element) => {
			const listChild = listCategories.filter((item) => element.cate_father === item.cate_father)
			
			const fatherInfo = listCategories.find((item) => element.cate_father === item.cate_id)

			return {
				cateId: fatherInfo.cate_id,
				cateName: fatherInfo.cate_name,
				listChild
			}
		})

		

		let result = []

		childResult.forEach((element) => {
			let productsWithCate = []
			element.listChild.forEach((item) => {
				const productsInfo = listProducts.filter((prodInfo) => prodInfo.prod_category_id === item.cate_id)

				productsInfo.forEach((prodInfo) => {
					const productImageInfo = listProductImages.find((prodImgInfo) => prodImgInfo.prod_img_product_id === prodInfo.prod_id)
					const prodInfoJson = {
						prodId: prodInfo.prod_id,
						prodName: prodInfo.prod_name,
						prodCategory: prodInfo.prod_category_id,
						prodAmount: prodInfo.prod_amount,
						prodPrice: prodInfo.prod_price,
						prodDescription: prodInfo.prod_description,
						prodImage: productImageInfo ? productImageInfo.prod_img_data : ''
					}

					productsWithCate.push(prodInfoJson)
				})
			})
			const resultInfo = {
				cateId: element.cateId,
				cateName: element.cateName,
				listProducts: productsWithCate
			}

			result.push(resultInfo)
		})

		return res.status(200).json({
			statusCode: successCode,
			information: result
		})
	}

	return res.status(400).json({
		statusCode: errorCode
	})
})

module.exports = router