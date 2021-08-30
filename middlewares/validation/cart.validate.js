const ajvLib = require('ajv')

const errorCode = 1

const addCart = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
    		prodId: { type: 'integer' },
			cartAmount: { type: 'integer' }
  		},
		required: ['prodId', 'cartAmount'],
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

const updateCartAmount = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cartId: { type: 'integer' }
  		},
		required: ['cartId'],
		additionalProperties: true
	}

	const ajv = new ajvLib({
		allerrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(400).json({
			errormessage: validator.errors[0].message,
			statuscode: errorCode
		})
	}

	next()
}

const checkPrice = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			listProduct: { 
				type: 'array',
				items: {
					type: 'object',
  					properties: {
						prodId: { type: 'integer' },
						cartAmount: { type: 'integer' }
  					},
					required: ['prodId'],
					additionalProperties: true
				}
			}
  		},
		required: ['listProduct'],
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

const deleteCart = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cartId: { type: 'integer' }
  		},
		required: ['cartId'],
		additionalProperties: true
	}

	const ajv = new ajvLib({
		allerrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(400).json({
			errormessage: validator.errors[0].message,
			statuscode: errorCode
		})
	}

	next()
}

module.exports = {
    addCart,
	updateCartAmount,
	checkPrice,
	deleteCart
}
