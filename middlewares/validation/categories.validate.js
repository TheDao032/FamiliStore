const ajvLib = require('ajv')

const newCategoryFather = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
    		cateId: { type: 'string', pattern: '' },
			cateName: { type: 'string', pattern: '' }
  		},
		required: ["cateId", "cateName"],
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

const newCategoryChild = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
    		cateId: { type: 'string', pattern: '' },
			cateName: { type: 'string', pattern: '' },
			cateFather: { type: 'string', pattern: '' }
  		},
		required: ["cateId", "cateName"],
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

const listCategoryChild = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cateFather: { type: 'string', pattern: '' }
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
		return res.status(400).json(validator.errors)
	}

	next()
}

module.exports = {
    newCategoryFather,
    newCategoryChild,
    listCategoryChild
}