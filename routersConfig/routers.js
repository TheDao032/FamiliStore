const express = require('express')
const router = express.Router()
const authenticattionController = require('../controllers/authentication.controller')
const categoriesController = require('../controllers/categories.controller')
const productController = require('../controllers/product.controller')
const authentication = require('../middlewares/authentication')

const API = require('./api')


router.use('/api/authentication', authenticattionController)
router.use('/api/categories', categoriesController)
router.use('/api/product', productController)
router.use('/api', authentication.verifyToken, API)


module.exports = router
