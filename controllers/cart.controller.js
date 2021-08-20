const express = require('express') 

const router = express.Router()
const knex = require('../utils/dbConnection')
const accountValidation = require('../middlewares/validation/account.validate')

const accountModel = require('../models/account.model')
const productModel = require('../models/product.model')
const cartModel = require('../models/cart.model')

const cartValidation = require('../middlewares/validation/cart.validate')

const successCode = 0
const errorCode = 1

router.post('/list', async (req, res) => {
	const { page, limit } = req.query
	const { accId } = req.body

	const listCart = await cartModel.findByAcc(accId)

	if (listCart.length === 0) {
		return res.status(200).json({
			errorMessage: 'Customer Does Not Have Any Product In Cart'
		})
	}
	const listProduct = await productModel.findAll()

	let totalPrice = 0
	let totalAmount = 0

	const result = Promise.all([
		listCart.map((item) => {
			const productInfo = listProduct.find((info) => info.prod_id === item.cart_prod_id)

			if (productInfo) {
				totalPrice = totalPrice + item.cart_amount * parseInt(productInfo[0].prod_price)
				totalAmount = totalAmount + item.cart_amount
				return {
					prodId: productInfo[0].prod_id,
					cartAmount: item.cart_amount,
					cartPrice: productInfo[0].prod_price
				}
			}

			return res.status(400).json({
				errorMessage: 'Some Product In Cart Is Invalid'
			})
		})
	])

	if (result) {
		if (result.length === 0) {
			return res.status(500).json({
				statusCode: errorCode
			})
		}

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
				totalAmount,
				totalPrice,
				listCart: paginationResult,
				statusCode: successCode
			})
		}

		return res.status(200).json({
			listCart: result[0],
			totalAmount,
			totalPrice,
			statusCode: successCode
		})
	}
	
	return res.status(500).json({
		statusCode: errorCode
	})
})

router.post('/add', cartValidation.addCart, async (req, res) => {
    const { accId, prodId } = req.body

	const productInfo = await productModel.findById(prodId)

	if (productInfo.length === 0) {
		return res.status(400).json({
			errorMessage: 'Product Does Not Exist',
			statusCode: errorCode
		})
	}

	const checkExist = await cartModel.findByAccAndProduct(accId, prodId)
	const presentDate = new Date()

	if (checkExist.length === 0) {


		const newCart = {
			cart_acc_id: accId,
			cart_prod_id: prodId,
			cart_amount: 1,
			cart_status: 1,
			cart_updated_date: presentDate
		}

		await cartModel.addcart(newCart)

		return res.status(200).json({
			statusCode: successCode
		})
	}

	const updateCart = {
		cart_amount: checkExist[0].cart_amount + 1,
		cart_updated_date: presendDate
	}

	await cartModel.updateCart(checkExist[0].cart_id, updateCart)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/update-amount', cartValidation.updateCartAmount, async (req, res) => {
	const { cartId, cartAmount } = req.body

	const checkExist = await cartModel.findById(cartId)

	if (checkExist.length === 0) {
		return res.status(400).json({
			errorMessage: 'This Product In Your Cart Is Invalid'
		})
	}

	const newAmount = {
		cart_amount: cartAmount
	}

	await cartModel.updateCart(cartId, newAmount)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/check-price', cartValidation.checkPrice, async (req, res) => {
	const { listProduct } = req.body

	const allProduct = await productModel.findAl()

	let totalPrice = 0

	listProduct.forEach((item) => {
		const productInfo = allProduct.find((info) => info.prod_id === item.prodId)

		if (productInfo) {
			totalPrice = totalPrice + (item.cartAmount * parseInt(productInfo[0].prod_price))
		}

		return res.status(400).json({
			errorMessage: 'This Product In Your Cart Is Invalid'
		})
	})

	return res.status(200).json({
		totalPrice,
		statusCode: successCode
	})
})

router.post('/delete', cartValidation.deleteCart, async (req, res) => {
	const { cartId } = req.body

	const checkExist = await cartModel.findById(cartId)

	if (checkExist.length === 0) {
		return res.status(400).json({
			errorMessage: 'This Product In Your Cart Is Invalid'
		})
	}

	await knex('tbl_cart').where({ cart_id: cartdId }).del()
	
	return res.status(200).json({
		statusCode: successCode
	})
})

module.exports = router
