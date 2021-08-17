const ajvLib = require('ajv')

const errorCode = 1

const newCategoryFather = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cateName: { type: 'string', pattern: '', maxLength: 100 }
  		},
		required: ['cateName'],
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

const newCategoryChild = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cateName: { type: 'string', pattern: '', maxLength: 100 },
			cateFather: { type: 'integer' }
  		},
		required: ['cateName', 'cateFather'],
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

const updateCategory = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
    		cateId: { type: 'integer' },
			cateName: { type: 'string', pattern: '', maxLength: 100 },
			cateFather: { type: 'integer' }
  		},
		required: ['cateId'],
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

const listCategoryChild = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cateFather: { type: 'integer' }
  		},
		required: ['cateFather'],
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

const deleteCategory = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cateId: { type: 'integer' },
  		},
		required: ['cateId'],
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
    newCategoryFather,
    newCategoryChild,
    listCategoryChild,
	deleteCategory,
	updateCategory
}