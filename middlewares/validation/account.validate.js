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
	  	required: ['accId', 'accOldPassword', 'accNewPassword', 'accConfirmPassword'],
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
		required: ['accId' , 'accRole'],
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
    		email: { type: 'string', pattern: '^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$', maxLength: 100 },
    		phoneNumber: { type: 'string', pattern: '', maxLength: 15 },
    		role: { type: 'string', pattern: '', maxLength: 5 }
  		},
		required: ['accId'],
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
		required: ['accId'],
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

module.exports = {
	updateAccountPassword,
	updateRoleAccount,
	updateAccount,
	avatar
}
