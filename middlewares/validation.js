const ajvLib = require('ajv')

const newAccount = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			userName: { type: 'string', pattern: '' },
    		passWord: { type: 'string', pattern: '' },
    		email: { type: 'string', pattern: '' },
    		phoneNumber: { type: 'string', pattern: '' },
    		role: { type: 'string', pattern: '' }
  		},
		required: ["userName", "passWord", "email", "role"],
		additionalProperties: true
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(400).json(valid.errors)
	}

	next()
}

const updateAccount = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			userName: { type: 'string', pattern: '' },
    		passWord: { type: 'string', pattern: '' },
    		email: { type: 'string', pattern: '' },
    		phoneNumber: { type: 'string', pattern: '' },
    		role: { type: 'string', pattern: '' }
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
		return res.status(400).json(valid.errors)
	}

	next()
}

const comfirmToken = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			accId: { type: 'string', pattern: '' },
			accToken: { type: 'string', pattern: '', }
		},
		required: ["accId", "accToken"],
		additionalProperties: false
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(400).json(valid.errors)
	}

	next()
}

const login = (req, res, next) => {
	const shema = {
		type: 'object',
		properties: {
			userName: { type: 'string', pattern: '' },
			passWord: { type: 'string', pattern: '', }
		},
		required: ["userName", "passWord"],
		additionalProperties: false
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(400).json(valid.errors)
	}

	next()
}

const newBill = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			accId: { type: 'string', pattern: '' },
    		totalPrice: { type: 'string', pattern: '' },
    		totalQuantity: { type: 'string', pattern: '' },
    		listProductId: { 
				type: 'array', 
				items: {
					type: 'object',
					properties: {
						prodId: { type: 'string', pattern: '' }
					},
					required: ["prodId"],
					additionalProperties: true
				},
			}
  		},
		required: ["accId", "totalPrice", "totalQuantity", "listProductId"],
		additionalProperties: true
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(400).json(valid.errors)
	}

	next()
}

const listBillDetail = (req, res, next) => {
	const shema = {
  		type: 'object',
  		properties: {
			accId: { type: 'integer' },
    		billId: { type: 'string', pattern: '' }
  		},
		required: ["accId", "billId"],
		additionalProperties: true
	}

	const ajv = new ajvLib({
		allErrors: true
	})

	const validator = ajv.compile(shema)
	const valid = validator(req.body)

	if (!valid) {
		return res.status(400).json(valid.errors)
	}

	next()
}

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
		return res.status(400).json(valid.errors)
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
		return res.status(400).json(valid.errors)
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
		return res.status(400).json(valid.errors)
	}

	next()
}

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
		return res.status(400).json(valid.errors)
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
		return res.status(400).json(valid.errors)
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
		return res.status(400).json(valid.errors)
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
		return res.status(400).json(valid.errors)
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
		return res.status(400).json(valid.errors)
	}

	next()
}

module.exports = {
	newAccount,
	updateAccount,
	comfirmToken,
	login,
 	newBill,
	listBillDetail,
	newCategoryFather,
	newCategoryChild,
	listCategoryChild,
	listDistricts,
	newCity,
	newDistrict,
	listDeliveries,
	newDelivery
}
