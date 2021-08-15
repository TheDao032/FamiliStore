const express = require('express')
const router = express.Router()
const authenticattionController = require('../controllers/authentication.controller')
const authentication = require('../middlewares/authentication')

const API = require('./api')


router.use('/api/authentication', authenticattionController)
router.use('/api', authentication.verifyToken, API)
<<<<<<< HEAD

=======
router.use('/api', API)
>>>>>>> 9dbc89138423a5d13d73a0032bd4a21570c2ad1b

module.exports = router
