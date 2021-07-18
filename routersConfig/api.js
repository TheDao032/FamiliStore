const express = require('express')

const API = express.Router()

const actorController = require('../controllers/actors.controller')
const customerController = require('../controllers/customers.controller')

API.use('/actors', actorController)
API.use('/customers', customerController)

module.exports = API
