const express = require('express')

const API = express.Router()

const accountController = require('../controllers/account.controller')
const productController = require('../controllers/product.controller')
const billController = require('../controllers/bill.controller')
const categoriesController = require('../controllers/categories.controller')

API.use('/account', accountController)
API.use('/product', productController)
API.use('/bill', billController)
API.use('/categories', categoriesController)

module.exports = API
