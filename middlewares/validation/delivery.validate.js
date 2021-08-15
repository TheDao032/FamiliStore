const ajvLib = require('ajv')

const listDistricts = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cityId: { type: ['string', 'integer'] }
  		},
		required: ['cityId'],
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

const listWards = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cityId: { type: ['string', 'integer'] },
			districtId: { type: ['string', 'integer'] }
  		},
		required: ['cityId', 'districtId'],
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

const listDeliveries = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			accId: { type: ['integer', 'string'] }
  		},
		required: ['accId'],
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

const newCity = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cityName: { type: 'string', pattern: '' }
  		},
		required: ['cityName'],
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

const newDistrict = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cityId: { type: ['string', 'integer'] },
			distName: { type: 'string', pattern: '' }
  		},
		required: ['cityId', 'distName'],
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

const newWard = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cityId: { type: ['string', 'integer'] },
			distId: { type: ['string', 'integer'] },
			wardName: { type: 'string', pattern: '' },
			wardShipPrice: { type: 'string', pattern: '' }
  		},
		required: ['cityId', 'distId', 'wardName', 'wardShipPrice'],
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

const newDelivery = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cityId: { type: ['string', 'integer'] },
			distId: { type: ['string', 'integer'] },
			wardId: { type: ['string', 'integer'] },
			accId: { type: ['string', 'integer'] },
			delDetailAddress: { type: 'string', pattern: '' }
  		},
		required: ['cityId', 'distId', 'accId', 'delDetailAddress', 'wardId'],
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
    listDistricts,
    listDeliveries,
    newCity,
    newDistrict,
    newDelivery,
	newWard,
	listWards
}
