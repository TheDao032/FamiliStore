const ajvLib = require('ajv')

//comment validation
const listProduct = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			page: { type: 'integer' },
			limit: { type: 'integer' }
		},
		required: ["page", "limit"],
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

const listSuggestion = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			page: { type: 'integer' },
			limit: { type: 'integer' },
			catID : {type: 'integer'}
		},
		required: ["page", "limit", "catID"],
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

const listByCategory = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			catID: {type : 'string', pattern : ''},
			page: { type: 'integer'},
			limit: { type: 'integer'}
		},
		required: ["catID", "page", "limit"],
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
const updateProduct = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			prodName: { type: 'string' },
			prodCategoryID: { type: 'integer' },
			prodAmount: { type: 'integer'},
			prodPrice: { type: 'integer' }
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
		return res.status(400).json(validator.errors[0])
	}

	next()
}


const listBestSale = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			limit: { type: 'integer'},
			page: { type: 'integer'}
		},
		required: ["limit", "page"],
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
	listProduct,
	updateProduct,
	listByCategory,
	listSuggestion,
	listBestSale
}