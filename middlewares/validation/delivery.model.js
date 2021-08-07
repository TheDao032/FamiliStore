const ajvLib = require('ajv')

const listDistricts = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cityId: { type: 'integer' }
  		},
		required: ["cityId"],
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

const listDeliveries = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			accId: { type: 'integer' }
  		},
		required: ["accId"],
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

const newCity = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cityId: { type: 'string', pattern: '' },
			cityName: { type: 'string', pattern: '' }
  		},
		required: ["cityId", "cityName"],
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

const newDistrict = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cityId: { type: 'string', pattern: '' },
			distId: { type: 'string', pattern: '' },
			distName: { type: 'string', pattern: '' },
			distShipPrice: { type: 'string', pattern: '' }
  		},
		required: ["cityId", "distId", "distName", "distShipPrice"],
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

const newDelivery = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cityId: { type: 'string', pattern: '' },
			distId: { type: 'string', pattern: '' },
			accId: { type: 'integer' },
			delDetailAddress: { type: 'string', pattern: '' }
  		},
		required: ["cityId", "distId", "accId", "delDetailAddress"],
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
    listDistricts,
    listDeliveries,
    newCity,
    newDistrict,
    newDelivery
}