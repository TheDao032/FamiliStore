const ajvLib = require('ajv')

const errorCode = 1

//comment validation
const listComment = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			productID: { type: 'integer' },
			page: { type: 'integer' },
			limit : {type:'integer'}
		},
		required: ['productID', 'page', 'limit'],
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
const newComment = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			billID: { type: 'integer' },
			productID: { type: 'integer' },
			content: { type: 'string', pattern: '' ,  maxLength: 200},
			vote: { type: 'integer' }
		},
		required: ['productID', 'content', 'vote'],
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
const updateComment  = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			commentID: { type: 'integer' },
			content: { type: 'string', pattern: '',  maxLength: 200},
			vote: { type: 'integer' }
		},
		required: ['commentID'],
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

const deleteComment  = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			commentID: { type: 'integer' }
		},
		required: ['commentID'],
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
    newComment,
	updateComment,
	deleteComment,
	listComment
}