const express = require('express')
const router = express.Router()
const authenticattionController = require('../controllers/authentication.controller')
const authentication = require('../middlewares/authentication')

const API = require('./api')


router.use('/api/authentication', authenticattionController)
//router.use('/api', authentication.verifyToken, API)
router.use('/api', API)

module.exports = router
