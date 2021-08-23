const request = require('supertest');
const randomstring = require('randomstring')

const server = require('../server')
const knex = require('../utils/dbConnection')
const deliveryModel = require('../models/delivery.model')

let staticWard
let staticDistrict
let staticCity
let staticDelivery

describe("POST /add-city", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body
		const allCities = await deliveryModel.findAllCities()

		let newCityName = randomstring.generate(50)
	    let checkExist = allCities.find((info) => (info.ci_name.toLowerCase() === newCityName.toLowerCase()))
        
        while (checkExist) {
            newCityName = randomstring.generate(50)
            checkExist = allCities.find((info) => (info.ci_name.toLowerCase() === newCityName.toLowerCase()))
        }
        
        const deliveryListRespone = await request(server).post('/api/delivery/add-city')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                cityName: newCityName
                                            })
        const { cityId } = deliveryListRespone.body
        staticCity = cityId

        expect(deliveryListRespone.statusCode).toBe(200)
    })
})

describe("POST /update-city", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body
        const allCities = await deliveryModel.findAllCities()

		let newCityName = randomstring.generate(50)
	    let checkExist = allCities.find((info) => (info.ci_name.toLowerCase() === newCityName.toLowerCase()) && (info.ci_id !== cityId))
        
        while (checkExist) {
            newCityName = randomstring.generate(50)
            checkExist = allCities.find((info) => (info.ci_name.toLowerCase() === newCityName.toLowerCase()) && (info.ci_id !== cityId))
        }

        const deliveryListRespone = await request(server).post('/api/delivery/update-city')
                                            .set('Authorization', data.accessToken)
                                            .send({
												cityId: staticCity,
                                                cityName: newCityName
                                            })

        expect(deliveryListRespone.statusCode).toBe(200)
    })
})

describe("POST /add-district", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body
		const allDistricts = await deliveryModel.findAllDistricts()

		let newDistrictName = randomstring.generate(50)
	    let checkExist = allDistricts.find((info) => (info.dis_name.toLowerCase() === newDistrictName.toLowerCase()))
        
        while (checkExist) {
            newDistrictName = randomstring.generate(50)
            checkExist = allDistricts.find((info) => (info.dis_name.toLowerCase() === newDistrictName.toLowerCase()))
        }

        const deliveryListRespone = await request(server).post('/api/delivery/add-district')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                distName: newDistrictName, 
                                                cityId: staticCity
                                            })

        const { distId } = deliveryListRespone.body
        staticDistrict = distId
        expect(deliveryListRespone.statusCode).toBe(200) 
    })
})

describe("POST /update-district", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body
        const allDistricts = await deliveryModel.findAllDistricts()

		let newDistrictName = randomstring.generate(50)
	    let checkExist = allDistricts.find((info) => (info.dis_name.toLowerCase() === newDistrictName.toLowerCase()) && (info.dis_id !== distId))
        
        while (checkExist) {
            newDistrictName = randomstring.generate(50)
            checkExist = allDistricts.find((info) => (info.dis_name.toLowerCase() === newDistrictName.toLowerCase()) && (info.dis_id !== distId))
        }

        const deliveryListRespone = await request(server).post('/api/delivery/update-district')
                                            .set('Authorization', data.accessToken)
                                            .send({
												distId: staticDistrict,
                                                distName: newDistrictName, 
                                            })

        expect(deliveryListRespone.statusCode).toBe(200) 
    })
})

describe("POST /add-ward", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body
		const allWards = await deliveryModel.findAllWards()

		let newWardName = randomstring.generate(50)
	    let checkExist = allWards.find((info) => (info.ward_name.toLowerCase() === newWardName.toLowerCase()))
        
        while (checkExist) {
            newWardName = randomstring.generate(50)
            checkExist = allWards.find((info) => (info.ward_name.toLowerCase() === newWardName.toLowerCase()))
        }


        const deliveryListRespone = await request(server).post('/api/delivery/add-ward')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                distId: staticDistrict,
                                                cityId: staticCity,
                                                wardName: newWardName,
                                                wardShipPrice: "1000"
                                            })
        const { wardId } = deliveryListRespone.body
        staticWard = wardId
        expect(deliveryListRespone.statusCode).toBe(200) 
    })
})

describe("POST /update-ward", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body
		const allWards = await deliveryModel.findAllWards()

		let newWardName = randomstring.generate(50)
	    let checkExist = allWards.find((info) => (info.ward_name.toLowerCase() === newWardName.toLowerCase()) && (info.ward_id !== wardId))
        
        while (checkExist) {
            newWardName = randomstring.generate(50)
            checkExist = allWards.find((info) => (info.ward_name.toLowerCase() === newWardName.toLowerCase()) && (info.ward_id !== wardId))
        }


        const deliveryListRespone = await request(server).post('/api/delivery/update-ward')
                                            .set('Authorization', data.accessToken)
                                            .send({
												wardId: staticWard,
                                                wardName: newWardName,
                                                wardShipPrice: "2000"

                                            })

        expect(deliveryListRespone.statusCode).toBe(200) 
    })
})

describe("POST /add-delivery", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body
		const allDeliveries = await deliveryModel.findAllDeliveries()

		let newDetailAddress = randomstring.generate(100)
	    let checkExist = allDeliveries.find((info) => (info.del_detail_address.toLowerCase() === newDetailAddress.toLowerCase()))
        
        while (checkExist) {
            newDetailAddress = randomstring.generate(100)
            checkExist = allDeliveries.find((info) => (info.del_detail_address.toLowerCase() === newDetailAddress.toLowerCase()))
        }


        const deliveryListRespone = await request(server).post('/api/delivery/add-delivery')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                wardId: staticWard,
                                                accId: data.user.accId,
                                                delDetailAddress: newDetailAddress
                                            })

        const { delId } = deliveryListRespone.body
        staticDelivery = delId
        expect(deliveryListRespone.statusCode).toBe(200) 
    })
})

describe("POST /update-delivery", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body
        const allDeliveries = await deliveryModel.findAllDeliveries()

		let newDetailAddress = randomstring.generate(100)
	    let checkExist = allDeliveries.find((info) => (info.del_detail_address.toLowerCase() === newDetailAddress.toLowerCase()) && (info.del_id !== delId))
        
        while (checkExist) {
            newDetailAddress = randomstring.generate(100)
            checkExist = allDeliveries.find((info) => (info.del_detail_address.toLowerCase() === newDetailAddress.toLowerCase()) && (info.del_id !== delId))
        }


        const deliveryListRespone = await request(server).post('/api/delivery/update-delivery')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                delId: staticDelivery,
                                                wardId: staticWard,
                                                accId: data.user.accId,
                                                delDetailAddress: newDetailAddress
                                            })

        expect(deliveryListRespone.statusCode).toBe(200) 
    })
})

describe("GET /list-cities", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

        const deliveryListRespone = await request(server).get('/api/delivery/list-cities')
                                            .set('Authorization', data.accessToken)

        expect(deliveryListRespone.statusCode).toBe(200)
    })
})

describe("POST /list-districts", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body
        const allCities = await deliveryModel.findAllCities()

        const deliveryListRespone = await request(server).post('/api/delivery/list-districts')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                cityId: allCities[0].ci_id
                                            })

        expect(deliveryListRespone.statusCode).toBe(200) 
    })
})

describe("POST /list-ward", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body
        const allDistricts = await deliveryModel.findAllDistricts()

        const deliveryListRespone = await request(server).post('/api/delivery/list-ward')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                cityId: allDistricts[0].dis_city_id,
                                                districtId: allDistricts[0].dis_id
                                            })

        expect(deliveryListRespone.statusCode).toBe(200) 
    })
})

describe("POST /list-deliveries", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

        const deliveryListRespone = await request(server).post('/api/delivery/list-deliveries')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                accId: data.user.accId
                                            })

        expect(deliveryListRespone.statusCode).toBe(200) 
    })
})

describe("POST /delete-delivery", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

        const deliveryListRespone = await request(server).post('/api/delivery/delete-delivery')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                delId: staticDelivery
                                            })

        expect(deliveryListRespone.statusCode).toBe(200) 
    })
})

describe("POST /delete-ward", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

        const deliveryListRespone = await request(server).post('/api/delivery/delete-ward')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                wardId: staticWard
                                            })

        expect(deliveryListRespone.statusCode).toBe(200)
    })
})

describe("POST /delete-district", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

        const deliveryListRespone = await request(server).post('/api/delivery/delete-district')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                distId: staticDistrict
                                            })


        expect(deliveryListRespone.statusCode).toBe(200)
    })
})

describe("POST /delete-city", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

        const deliveryListRespone = await request(server).post('/api/delivery/delete-city')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                cityId: staticCity
                                            })

        expect(deliveryListRespone.statusCode).toBe(200)
    })
})