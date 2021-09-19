const ajvLib = require('ajv')

const errorCode = 1

const login = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			email: { type: 'string', pattern: '' },
			passWord: { type: 'string', pattern: '' }
		},
		required: ['email', 'passWord'],
		additionalProperties: false
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(400).json({
			errorMessage: validator.errors[0].message,
			statusCode: errorCode
		})
	}

	next()
}

const register = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
    		passWord: { type: 'string', pattern: '', minLength: 1 },
    		email: { type: 'string', pattern: '^[a-z][a-z0-9_\.]{3,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$', maxLength: 100 },
    		phoneNumber: { type: 'string', pattern: '', maxLength: 15 },
    		role: { type: 'string', pattern: '', maxLength: 5},
			fullName: { type: 'string', pattern: '', maxLength: 90}
  		},
		required: ['passWord', 'email'],
		additionalProperties: true
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(400).json({
			errorMessage: validator.errors[0].message,
			statusCode: errorCode
		})
	}

	next()
}

const confirmToken = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			accId: { type: 'integer' },
			accToken: { type: 'string', pattern: '', }
		},
		required: ['accId', 'accToken'],
		additionalProperties: false
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(400).json({
			errorMessage: validator.errors[0].message,
			statusCode: errorCode
		})
	}

	next()
}



const forgotPassword = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			email: { type: 'string', pattern: '', maxLength: 100 }
		},
		required: ['email'],
		additionalProperties: false
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(400).json({
			errorMessage: validator.errors[0].message,
			statusCode: errorCode
		})
	}

	next()
}

const newPassword = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			accId: { type: 'integer' },
			accPassword: { type: 'string', pattern: '' , minLength: 1 },
			tokenChangePass: { type: 'string', pattern: '' }
		},
		required: ['accId', 'accPassword', 'tokenChangePass'],
		additionalProperties: false
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(400).json({
			errorMessage: validator.errors[0].message,
			statusCode: errorCode
		})
	}

	next()
}

const refreshToken = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			accessToken: { type: 'string', pattern: '' },
			refreshToken: { type: 'string', pattern: '' }
		},
		required: ['accessToken', 'refreshToken'],
		additionalProperties: false
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(400).json({
			errorMessage: validator.errors[0].message,
			statusCode: errorCode
		})
	}

	next()
}

module.exports = {
    login,
    register,
    confirmToken,
    forgotPassword,
    newPassword,
	refreshToken
}