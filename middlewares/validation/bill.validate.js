const ajvLib = require('ajv')

const newBill = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			accId: { type: 'string', pattern: '' },
    		totalPrice: { type: 'string', pattern: '' },
    		totalQuantity: { type: 'integer'},
    		listProduct: { 
				type: 'array', 
				items: {
					type: 'object',
					properties: {
						prodId: { type: 'integer'},
						prodQuantity: {type:'integer'}
					},
					required: ["prodId", "prodQuantity"],
					additionalProperties: true
				},
			}
  		},
		required: ["accId", "totalPrice", "totalQuantity", "listProduct"],
		additionalProperties: true
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(400).json(validator.errors[0])
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
		required: ["accId", "billId"],
		additionalProperties: true
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(400).json(validator.errors[0])
	}

	next()
}


module.exports = {
    newBill,
    listBillDetail
}