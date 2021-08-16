const express = require('express')

const API = express.Router()

const accountController = require('../controllers/account.controller')
const billController = require('../controllers/bill.controller')
const wareHouseController = require('../controllers/wareHouse.controller')
const deliveriesController = require('../controllers/deliveryAddress.controller')
const commentController = require('../controllers/comment.controller')
API.use('/account', accountController)
API.use('/bill', billController)
API.use('/ware-house', wareHouseController)
API.use('/delivery', deliveriesController)
API.use('/comment', commentController)

API.use((req, res, next) => {
	return res.status(400).json({
		errorMessage: 'API Url Not Found',
		statusCode: 1
	})
})

API.use((err, req, res, next) => {
	return res.status(500).json({
		err,
		statusCode: 1
	})
})

module.exports = API
