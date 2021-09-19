const express = require('express')
const router = express.Router()
const authenticattionController = require('../controllers/authentication.controller')
const categoriesController = require('../controllers/categories.controller')
const productController = require('../controllers/product.controller')
const authentication = require('../middlewares/authentication')

const API = require('./api')


router.use('/api/authentication', authenticattionController)
router.use('/api/categories', categoriesController)
router.use('/api/product', authentication.verifyTokenUnAuth, productController)
router.use('/api', authentication.verifyToken, API)

router.use((req, res, next) => {
	return res.status(400).json({
		errorMessage: 'API Url Not Found',
		statusCode: 1
	})
})

router.use((err, req, res, next) => {
	return res.status(500).json({
		err,
		statusCode: 1
	})
})

module.exports = router
