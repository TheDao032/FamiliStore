const request = require('supertest');

const server = require('../server')
const knex = require('../utils/dbConnection')

describe("POST /add-city", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

        const deliveryListRespone = await request(server).post('/api/delivery/add-city')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                cityName: "campu"
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

        const deliveryListRespone = await request(server).post('/api/delivery/add-district')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                distId: 1000,
                                                distName: "campu1", 
                                                cityId: 1000
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

        const deliveryListRespone = await request(server).post('/api/delivery/add-ward')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                distId: 1000,
                                                cityId: 1000,
                                                wardId: 1000,
                                                wardName: "campu2",
                                                wardShipPrice: "1000"

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

        const deliveryListRespone = await request(server).post('/api/delivery/add-delivery')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                distId: 1000,
                                                cityId: 1000,
                                                wardId: 1000,
                                                accId: data.user.accId,
                                                delDetailAddress: "campu3"
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

        const deliveryListRespone = await request(server).post('/api/delivery/list-districts')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                cityId: 1000
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

        const deliveryListRespone = await request(server).post('/api/delivery/list-ward')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                cityId: 1000,
                                                districtId: 1000
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

        await knex('tbl_delivery_address').where({ del_detail_address: "campu3" }).del()
        await knex('tbl_wards').where({ ward_name: "campu2" }).del()
        await knex('tbl_districts').where({ dis_name: "campu1" }).del()
        await knex('tbl_cities').where({ ci_name: "campu" }).del()
        expect(deliveryListRespone.statusCode).toBe(200) 
    })
})