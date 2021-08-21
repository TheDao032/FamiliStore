const ajvLib = require('ajv')

const errorCode = 1

const addCart = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			accId: { type: 'integer' },
    		prodId: { type: 'integer' }
  		},
		required: ['accId', 'prodId'],
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

const updatecartamount = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cartid: { type: 'integer' }
  		},
		required: ['cartid'],
		additionalproperties: true
	}

	const ajv = new ajvlib({
		allerrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(400).json({
			errormessage: validator.errors[0].message,
			statuscode: errorcode
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
						cardAmount: { type: 'integer' }
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
			cartid: { type: 'integer' }
  		},
		required: ['cartid'],
		additionalproperties: true
	}

	const ajv = new ajvlib({
		allerrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(400).json({
			errormessage: validator.errors[0].message,
			statuscode: errorcode
		})
	}

	next()
}

module.exports = {
    addCart,
	updateCartAmount,
	checkAmount,
	checkPrice,
	deleteCart
}
