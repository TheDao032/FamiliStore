const ajvLib = require('ajv')

//comment validation
const updateProduct = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			prodName: { type: 'string', pattern: '' },
			prodCategoryID: { type: 'string', pattern: '' },
			prodAmount: { type: 'integer', pattern: '' },
            prodPrice: { type: 'integer', pattern: '' }
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
		return res.status(400).json(validator.errors)
	}

	next()
}

const validateProductNumber = function(){
	
}
module.exports = {
    updateProduct
}