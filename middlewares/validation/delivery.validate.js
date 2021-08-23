const ajvLib = require('ajv')

const errorCode = 1

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
			cityName: { type: 'string', pattern: '', minLength: 1, maxLength: 50 }
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

const updateCity = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cityId: { type: 'integer' },
			cityName: { type: 'string', pattern: '', minLength: 1, maxLength: 50 }
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

const newDistrict = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cityId: { type: 'integer' },
			distName: { type: 'string', pattern: '', minLength: 1, maxLength: 50 }
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

const updateDistrict = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			distId: { type: 'integer' },
			distName: { type: 'string', pattern: '', minLength: 1, maxLength: 50 },
			cityId: { type: 'integer' }
  		},
		required: ['distId'],
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
			distId: { type: 'integer' },
			wardName: { type: 'string', pattern: '', minLength: 1, maxLength: 50 },
			wardShipPrice: { type: 'string', pattern: '^\\d+$', maxLength: 100 }
  		},
		required: ['distId', 'wardName', 'wardShipPrice'],
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

const updateWard = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			wardId: { type: 'integer' },
			wardName: { type: 'string', pattern: '', minLength: 1, maxLength: 50 },
			wardShipPrice: { type: 'string', pattern: '^\\d+$', maxLength: 100 },
			distId: { type: 'integer' }
  		},
		required: ['wardId'],
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
			wardId: { type: 'integer' },
			accId: { type: 'integer' },
			delDetailAddress: { type: 'string', pattern: '', minLength: 1, maxLength: 100 }
  		},
		required: ['accId', 'delDetailAddress', 'wardId'],
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

const updateDelivery = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			delId:  { type: 'integer' },
			wardId: { type: 'integer' },
			delDetailAddress: { type: 'string', pattern: '', minLength: 1, maxLength: 100 }
  		},
		required: ['delId'],
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

const deleteDelivery = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			delId:  { type: 'integer' },
  		},
		required: ['delId'],
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

const deleteWard = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			wardId:  { type: 'integer' },
  		},
		required: ['wardId'],
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

const deleteDistrict = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			distId:  { type: 'integer' },
  		},
		required: ['distId'],
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

const deleteCity = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			cityId:  { type: 'integer' },
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

module.exports = {
    listDistricts,
    listDeliveries,
    newCity,
    newDistrict,
    newDelivery,
	newWard,
	listWards,
	updateCity,
	updateDistrict,
	updateWard,
	updateDelivery,
	deleteDelivery,
	deleteWard,
	deleteDistrict,
	deleteCity
}
