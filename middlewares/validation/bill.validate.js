const ajvLib = require('ajv')

const errorCode = 1

const newBill = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			accId: { type: 'integer' },
    		accAddress: { type: 'string', pattern: '', maxLength: 100 },
			priceShip: {type: 'string', pattern: '', maxLength: 100 },
    		listProduct: { 
				type: 'array', 
				items: {
					type: 'object',
					properties: {
						prodId: { type: 'integer' },
						prodQuantity: {type: 'integer' }
					},
					required: ['prodId', 'prodQuantity'],
					additionalProperties: true
				},
			}
  		},

		required: ['accId', 'accAddress', 'priceShip', 'listProduct'],
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

const updateStatusBill = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			billId: { type: 'integer' },
    		status: { type: 'string', pattern: '' }
  		},
		required: ['billId', 'status'],
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

const listBillDetail = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			accId: { type: 'integer' },
    		billId: { type: 'string', pattern: '' }
  		},
		required: ['accId', 'billId'],
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
const validateNumberOfProduct =  function (productList){

}

module.exports = {
    newBill,
    listBillDetail,
	validateNumberOfProduct,
	updateStatusBill,
    listBillDetail
}