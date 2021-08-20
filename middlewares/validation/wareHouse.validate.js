const ajvLib = require('ajv')

const errorCode = 1

const newWareHouse = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			stoProductName: { type: 'string', pattern: '', maxLength: 100 },
			stoAmount: { type: 'integer' },
			stoCategoryId: { type: 'integer' },
			stoOriginPrice: { type: 'string', pattern: '^\\d+$', maxLength: 100 },
			stoProductId: { type: 'integer' },
			cost: { type: 'string', pattern: '', maxLength: 100 }
  		},
		required: ['stoAccountId', 'stoCategoryId', 'stoProductId'],
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

const updateWareHouse = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			stoId: { type: 'integer' },
			stoAccountId: { type: 'integer' },
			stoProductName: { type: 'string', pattern: '', maxLength: 100 },
			stoAmount: { type: 'integer',},
			stoCategoryId: { type: 'integer' },
			stoOriginPrice: { type: 'string', pattern: '^\\d+$', maxLength: 100 },
			stoProductId: { type: 'integer' },
			cost: { type: 'string', pattern: '', maxLength: 100 }
  		},
		required: ['stoId', 'stoAccountId', 'stoCategoryId', 'stoProductId'],
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
    newWareHouse,
    updateWareHouse
}