const ajvLib = require('ajv')

const newCategoryFather = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cateName: { type: 'string', pattern: '' }
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
		return res.status(400).json(validator.errors[0])
	}

	next()
}

const newCategoryChild = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cateName: { type: 'string', pattern: '' },
			cateFather: { type: ['string', 'integer'] }
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
		return res.status(400).json(validator.errors[0])
	}

	next()
}

const updateCategory = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
    		cateId: { type: ['string', 'integer'] },
			cateName: { type: 'string', pattern: '' },
			cateFather: { type: ['string', 'integer'] }
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
		return res.status(400).json(validator.errors[0])
	}

	next()
}

const listCategoryChild = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cateFather: { type: ['string', 'integer']}
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
		return res.status(400).json(validator.errors[0])
	}

	next()
}

const deleteCategory = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cateId: { type: ['string', 'integer'] },
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
		return res.status(400).json(validator.errors[0])
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