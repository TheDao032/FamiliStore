const ajvLib = require('ajv')

const updateAccountPassword = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
		  accId: { type: ['integer', 'string'] },
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
	  	return res.status(500).json(validator.errors[0])
  	}

 	next()
}

const updateRoleAccount = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			accId: { type: ['integer', 'string'] },
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
		return res.status(500).json(validator.errors[0])
	}

	next()
}

const updateAccount = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			accId: { type: ['string', 'integer'] },
    		email: { type: 'string', pattern: '' },
    		phoneNumber: { type: 'string', pattern: '' },
    		role: { type: 'string', pattern: '' }
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
		return res.status(500).json(validator.errors[0])
	}

	next()
}

const avatar = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
    		accId: { type: ['string', 'integer'] },
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
		return res.status(500).json(validator.errors[0])
	}

	next()
}

module.exports = {
	updateAccountPassword,
	updateRoleAccount,
	updateAccount,
	avatar
}
