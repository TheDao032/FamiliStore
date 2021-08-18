const request = require('supertest');

const server = require('../server')
const knex = require('../utils/dbConnection')

describe("POST /list", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

        const categoryListRespone = await request(server).post('/api/comment/list')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                productID: 1000,
                                                page: 1,
                                                limit: 2
                                            })

        expect(categoryListRespone.statusCode).toBe(200)
    })
})

describe("POST /add", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

        const categoryListRespone = await request(server).post('/api/comment/add')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                productID: 1000,
                                                accountID: 26,
                                                content: '1999-',
                                                vote: 2
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

        const result = await knex('tbl_comment').where({cmt_content: '1999-'})
        const categoryListRespone = await request(server).post('/api/comment/update')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                commentID: result[0].cmt_id,
                                                accountID: 26,
                                                content: '1999-',
                                                vote: 3
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

        const result = await knex('tbl_comment').where({cmt_content: '1999-'})
        const categoryListRespone = await request(server).post('/api/comment/delete')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                commentID: result[0].cmt_id,
                                                accountID: 26
                                            })

        expect(categoryListRespone.statusCode).toBe(200)
    })
})