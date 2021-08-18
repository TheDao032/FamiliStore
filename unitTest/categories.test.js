const request = require('supertest');

const server = require('../server')
const knex = require('../utils/dbConnection')

describe("POST /add-father", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

        const categoryListRespone = await request(server).post('/api/categories/add-father')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                cateName: "category100"
                                            })

        expect(categoryListRespone.statusCode).toBe(200)
    })
})

describe("POST /add-child", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

        const categoryListRespone = await request(server).post('/api/categories/add-child')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                cateName: "cate100",
                                                cateFather: 1
                                            })

        expect(categoryListRespone.statusCode).toBe(200)
    })
})

describe("GET /list", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

        const categoryListRespone = await request(server).get('/api/categories/list')
                                            .set('Authorization', data.accessToken)

        expect(categoryListRespone.statusCode).toBe(200)
    })
})

describe("GET /list-father", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

        const categoryListRespone = await request(server).get('/api/categories/list-father')
                                            .set('Authorization', data.accessToken)

        expect(categoryListRespone.statusCode).toBe(200)
    })
})

describe("POST /list-child", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

        const categoryListRespone = await request(server).post('/api/categories/list-child')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                cateFather: 1
                                            })

        expect(categoryListRespone.statusCode).toBe(200)
    })
})

describe("POST /update", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

        const result = await knex('tbl_categories').where({ cate_name: "cate100" })

        const categoryListRespone = await request(server).post('/api/categories/update')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                cateId: result[0].cate_id,
                                                cateName: "cate1001"
                                            })

        expect(categoryListRespone.statusCode).toBe(200)
    })
})

describe("POST /delete", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

        const result = await knex('tbl_categories').where({ cate_name: "category100" })
        
        const categoryListRespone = await request(server).post('/api/categories/delete')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                cateId: result[0].cate_id
                                            })

        await knex('tbl_categories').where({ cate_name: "cate1001" }).del()

        expect(categoryListRespone.statusCode).toBe(200)
    })
})