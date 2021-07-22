const express = require('express')

const API = express.Router()

const accountController = require('../controllers/account.controller')
const productController = require('../controllers/product.controller')

API.use('/account', accountController)
API.use('/product', productController)

module.exports = API
