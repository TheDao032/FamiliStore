const ajvLib = require('ajv')

const listDistricts = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cityId: { type: 'integer' }
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
		return res.status(400).json({
			errorMessage: validator.errors[0].message,
			statusCode: errorCode
		})
	}

	next()
}

const listWards = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cityId: { type: 'integer' },
			districtId: { type: 'integer' }
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
		return res.status(400).json({
			errorMessage: validator.errors[0].message,
			statusCode: errorCode
		})
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
		return res.status(400).json({
			errorMessage: validator.errors[0].message,
			statusCode: errorCode
		})
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
		return res.status(400).json({
			errorMessage: validator.errors[0].message,
			statusCode: errorCode
		})
	}

	next()
}

const newDistrict = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cityId: { type: 'integer' },
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
		return res.status(400).json({
			errorMessage: validator.errors[0].message,
			statusCode: errorCode
		})
	}

	next()
}

const newWard = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cityId: { type: 'integer' },
			distId: { type: 'integer' },
			wardName: { type: 'string', pattern: '' },
			wardShipPrice: { type: 'string', pattern: '^\d+$', maxLength: 100 }
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
		return res.status(400).json({
			errorMessage: validator.errors[0].message,
			statusCode: errorCode
		})
	}

	next()
}

const newDelivery = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cityId: { type: 'integer' },
			distId: { type: 'integer' },
			wardId: { type: 'integer' },
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
		return res.status(400).json({
			errorMessage: validator.errors[0].message,
			statusCode: errorCode
		})
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
