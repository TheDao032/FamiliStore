const ajvLib = require('ajv')

const updateAccountPassword = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
		  accId: { type: ['integer', 'string']},
		  accPassword: { type: 'string', pattern: ''},
		  accConfirmPassword: { type: 'string', pattern: ''},
		},
	  	required: ['accId', 'accPassword', 'accConfirmPassword'],
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
		return res.status(400).json(validator.errors)
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
		return res.status(400).json(validator.errors)
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
		return res.status(400).json(validator.errors)
	}

	next()
}

module.exports = {
	updateAccountPassword,
	updateRoleAccount,
	updateAccount,
	avatar
}
