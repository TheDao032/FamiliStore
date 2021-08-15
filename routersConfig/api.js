const express = require('express')

const API = express.Router()

const accountController = require('../controllers/account.controller')
const productController = require('../controllers/product.controller')
const billController = require('../controllers/bill.controller')
const categoriesController = require('../controllers/categories.controller')
const wareHouseController = require('../controllers/wareHouse.controller')
const deliveriesController = require('../controllers/deliveryAddress.controller')
const commentController = require('../controllers/comment.controller')
API.use('/account', accountController)
API.use('/product', productController)
API.use('/bill', billController)
API.use('/categories', categoriesController)
API.use('/ware-house', wareHouseController)
API.use('/delivery', deliveriesController)
API.use('/comment', commentController)

API.use((req, res, next) => {
	return res.status(404).json({
		errorMessage: 'API Url Not Found',
		statusCode: 1
	})
})

API.use((err, req, res, next) => {
	return res.status(500).json({
		errorMessage: err,
		statusCode: 1
	})
})

module.exports = API
