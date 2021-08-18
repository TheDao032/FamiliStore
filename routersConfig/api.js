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

module.exports = API
