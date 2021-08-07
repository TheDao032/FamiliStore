const ajvLib = require('ajv')

const login = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			email: { type: 'string', pattern: '' },
			passWord: { type: 'string', pattern: '', }
		},
		required: ["email", "passWord"],
		additionalProperties: false
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(400).json(validator.errors)
	}

	next()
}

const register = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
    		passWord: { type: 'string', pattern: '' },
    		email: { type: 'string', pattern: '' },
    		phoneNumber: { type: 'string', pattern: '', maxLength: 15 },
    		role: { type: 'string', pattern: '', maxLength: 5}
  		},
		required: ["passWord", "email"],
		additionalProperties: true
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(400).json(validator.errors)
	}

	next()
}

const confirmToken = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			accId: { type: 'integer'},
			accToken: { type: 'string', pattern: '', }
		},
		required: ["accId", "accToken"],
		additionalProperties: false
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(400).json(validator.errors)
	}

	next()
}



const forgotPassword = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			email: { type: 'string', pattern: '' }
		},
		required: ["email"],
		additionalProperties: false
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(400).json(validator.errors)
	}

	next()
}

const newPassword = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			accId: { type: 'integer'},
			accPassword: { type: 'string', pattern: '' , minLength: 3 },
			tokenChangePass: { type: 'string', pattern: '' }
		},
		required: ["accId", "accPassword", "tokenChangePass"],
		additionalProperties: false
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(400).json(validator.errors)
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
		required: ["accessToken", "refreshToken"],
		additionalProperties: false
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(400).json(validator.errors)
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