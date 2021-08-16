const ajvLib = require('ajv')

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
		return res.status(500).json(validator.errors[0])
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
		return res.status(500).json(validator.errors[0])
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
		required: ["cateId"],
		additionalProperties: true
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(500).json(validator.errors[0])
	}

	next()
}

const listCategoryChild = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cateFather: { type: 'integer' }
  		},
		required: ["cateFather"],
		additionalProperties: true
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(500).json(validator.errors[0])
	}

	next()
}

const deleteCategory = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cateId: { type: 'integer' },
  		},
		required: ["cateId"],
		additionalProperties: true
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(500).json(validator.errors[0])
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