const express = require('express')

const API = express.Router()

const accountController = require('../controllers/account.controller')
const billController = require('../controllers/bill.controller')
const wareHouseController = require('../controllers/wareHouse.controller')
const deliveriesController = require('../controllers/deliveryAddress.controller')
const commentController = require('../controllers/comment.controller')
const authenticateCategoriesController = require('../controllers/authenticateCategories.controller')
const authenticateProductController = require('../controllers/authenticateProduct.controller')

API.use('/account', accountController)
API.use('/bill', billController)
API.use('/ware-house', wareHouseController)
API.use('/delivery', deliveriesController)
API.use('/comment', commentController)
API.use('/auth-categories', authenticateCategoriesController)
API.use('/auth-product', authenticateProductController)

module.exports = API
