const ajvLib = require('ajv')

//comment validation
const newComment = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			productID: { type: 'integer' },
			accountID: { type: 'integer' },
			content: { type: 'string', pattern: '' },
			vote: { type: 'integer' }
		},
		required: ["productID", "accountID", "content", "vote"],
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
    newComment
}