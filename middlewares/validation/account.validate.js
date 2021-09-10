const ajvLib = require('ajv')

const errorCode = 1

const updateAccountPassword = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
		  accId: { type: 'integer' },
		  accOldPassword: { type: 'string', pattern: '' },
		  accNewPassword: { type: 'string', pattern: '', minLength: 1 },
		  accConfirmPassword: { type: 'string', pattern: '', minLength: 1 },
		},
	  	required: ['accOldPassword', 'accNewPassword', 'accConfirmPassword'],
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

const updateRoleAccount = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			accId: { type: 'integer' },
			accRole: { type: 'string', pattern: '' , maxLength: 5 },
  		},
		required: ['accId', 'accRole'],
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

const updateStatusAccount = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			accId: { type: 'integer' },
			accStatus: { type: 'integer' },
  		},
		required: ['accId', 'accStatus'],
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

const updateAccount = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			accId: { type: 'integer' },
			accFullName: {type: 'string'},
    		accEmail: { type: 'string', pattern: '^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$', maxLength: 100 },
    		accPhoneNumber: { type: 'string', pattern: '', maxLength: 15 }
  		},
		required: [],
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

const avatar = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
    		accId: { type: 'integer' },
  		},
		required: [],
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

const paramsInfo = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
    		id: { type: 'string', pattern: '^\\d+$' }
  		},
		required: ['id'],
		additionalProperties: true
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.params)

	if (!valid) {
		return res.status(400).json({
			errorMessage: validator.errors[0].message,
			statusCode: errorCode
		})
	}

	next()
}

module.exports = {
	updateAccountPassword,
	updateRoleAccount,
	updateStatusAccount,
	updateAccount,
	avatar,
	paramsInfo,
}
