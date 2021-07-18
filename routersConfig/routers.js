const express = require('express')
const router = express.Router()

const API = require('./api')

router.use('/api', API)

module.exports = router
