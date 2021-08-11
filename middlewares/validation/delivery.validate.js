const ajvLib = require('ajv')

const listDistricts = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cityId: { type: 'string', maxLength: 5 }
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
		return res.status(400).json(validator.errors)
	}

	next()
}

const listWards = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cityId: { type: 'string', maxLength: 5 },
			districtId: { type: 'string', maxLength: 5 }
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
		required: ['accId'],
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
		required: ['cityId', 'cityName'],
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
			distName: { type: 'string', pattern: '' }
  		},
		required: ['cityId', 'distId', 'distName'],
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

const newWard = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cityId: { type: 'string', pattern: '' },
			distId: { type: 'string', pattern: '' },
			wardId: { type: 'string', pattern: '' },
			wardName: { type: 'string', pattern: '' },
			wardShipPrice: { type: 'string', pattern: '' }
  		},
		required: ['cityId', 'distId', 'wardId', 'wardName', 'wardShipPrice'],
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
			cityId: { type: 'string', pattern: '', maxLength: 5 },
			distId: { type: 'string', pattern: '', maxLength: 5 },
			wardId: { type: 'string', pattern: '', maxLength: 5 },
			accId: { type: 'integer' },
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
		return res.status(400).json(validator.errors)
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
