const ajvLib = require('ajv')

const newWareHouse = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			stoAccountId: { type: 'integer'},
			stoProductName: { type: 'string', pattern: '' },
			stoAmount: { type: 'integer'},
			stoCategoryId: { type: 'string', pattern: ''},
			stoOriginPrice: { type: 'string', pattern: '' },
			stoProductId: { type: 'integer'},
			cost: { type: 'string', pattern: '' }
  		},
		required: ["stoAccountId", "stoCategoryId", "stoProductId"],
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

const updateWareHouse = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			stoId: { type: 'integer'},
			stoAccountId: { type: 'integer'},
			stoProductName: { type: 'string', pattern: '' },
			stoAmount: { type: 'integer',},
			stoCategoryId: { type: 'string', pattern: '' },
			stoOriginPrice: { type: 'string', pattern: '' },
			stoProductId: { type: 'integer'},
			cost: { type: 'string', pattern: '' }
  		},
		required: ["stoId","stoAccountId", "stoCategoryId", "stoProductId"],
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
    newWareHouse,
    updateWareHouse
}