const express = require('express')

const router = express.Router()

const jsonWebToken = require('jsonwebtoken')
const authenticationService = require('../services/authenticationService')
const authentication = require('../middlewares/authentication')
const environment = require('../environments/environment')

const errorCode = 1
const successCode = 0

router.post('/login', (req, res) => {
	const { username, password } = req.body
	if (!username || !password) {
		return res.status(400).json({
			errorMessage: 'Bad Request',
			code: errorCode
		})
	}
	authenticationService.authenticate(username, password, (err, auth = null, user = null) => {
		if (err) {
			res.status(401).json({
				err,
				code: 2
			})
			return
		}
		const token = jsonWebToken.sign(auth, environment.secret, {
			expiresIn: '24h',
			algorithm: 'HS256'
		})
		res.status(200).json({
			code: successCode,
			data: {
				user,
				token
			}
		})
	})
})

module.exports = router
