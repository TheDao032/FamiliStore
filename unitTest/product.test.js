const request = require('supertest');

const server = require('../server')
const knex = require('../utils/dbConnection')
const fs = require('fs')

describe("POST /list", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

        const productListRespone = await request(server).post('/api/product/list')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                page: 1,
                                                limit: 2
                                            })

        expect(productListRespone.statusCode).toBe(200) 
    })
})

describe("POST /list-suggestion", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

        const productListRespone = await request(server).post('/api/product/list-suggestion')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                page: 1,
                                                limit: 2,
                                                catID: 4
                                            })

        expect(productListRespone.statusCode).toBe(200) 
    })
})

describe("POST /list-by-cat", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

        const productListRespone = await request(server).post('/api/product/list-by-cat')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                page: 1,
                                                limit: 2,
                                                catID: 4
                                            })

        expect(productListRespone.statusCode).toBe(200) 
    })
})

describe("GET /details", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

        const productListRespone = await request(server).get('/api/product/details/' + 1)
                                            .set({'Authorization': data.accessToken})

        expect(productListRespone.statusCode).toBe(200) 
    })
})

// describe("POST /add", () => {
//     test("Respone With A 200 Status Code", async () => {
//         const loginRespone = await request(server).post('/api/authentication/login').send({
//             email: 'nthedao2705@gmail.com',
//             passWord: '2705'
//         })

//         expect(loginRespone.statusCode).toBe(200)

//         const { data } = loginRespone.body

//         const productListRespone = await request(server).post('/api/product/add')
//                                             .set({'Authorization': data.accessToken})
//                                             .send({
//                                                 prodName: 'product1000',
//                                                 prodCategoryID: '1',
//                                                 prodAmount: '10',
//                                                 prodPrice: '1000',
//                                                 prodDescription: 'product'
//                                             })

//         expect(productListRespone.statusCode).toBe(200) 
//     })
// })

// describe("POST /add", () => {
//     test("Respone With A 200 Status Code", async () => {
//         const loginRespone = await request(server).post('/api/authentication/login').send({
//             email: 'nthedao2705@gmail.com',
//             passWord: '2705'
//         })

//         expect(loginRespone.statusCode).toBe(200)

//         const { data } = loginRespone.body

//         const productListRespone = await request(server).post('/api/product/add')
//                                             .set('Authorization', data.accessToken)
//                                             .field('content-type', 'multipart/form-data')
//                                             .field('prodName', 'product100')
//                                             .field('prodCategoryID', '4')
//                                             .field('prodAmount', '10')
//                                             .field('prodPrice', '1000')
//                                             .field('prodDescription', 'product100')
//                                             .attach('images', fs.readFileSync(`test/product100.png`), 'test/product100.png')

//         expect(productListRespone.statusCode).toBe(200) 
//     })
// })

// describe("POST /update", () => {
//     test("Respone With A 200 Status Code", async () => {
//         const loginRespone = await request(server).post('/api/authentication/login').send({
//             email: 'nthedao2705@gmail.com',
//             passWord: '2705'
//         })

//         expect(loginRespone.statusCode).toBe(200)

//         const { data } = loginRespone.body

//         const productListRespone = await request(server).post('/api/product/update/' + 1)
//                                             .set({'Authorization': data.accessToken})
//                                             .send({
//                                                 prodName: 'orion2',
//                                                 prodCategoryID: 4
//                                             })

//         expect(productListRespone.statusCode).toBe(200) 
//     })
// })

// describe("POST /update-image", () => {
//     test("Respone With A 200 Status Code", async () => {
//         const loginRespone = await request(server).post('/api/authentication/login').send({
//             email: 'nthedao2705@gmail.com',
//             passWord: '2705'
//         })

//         expect(loginRespone.statusCode).toBe(200)

//         const { data } = loginRespone.body

//         const productListRespone = await request(server).post('/api/product/update-image/' + 3)
//                                             .set({'Authorization': data.accessToken})
//                                             .field('content-type', 'multipart/form-data')
//                                             .attach('images', fs.readFileSync(`test/product100.png`), 'test/product100.png')

//         expect(productListRespone.statusCode).toBe(200) 
//     })
// })

// describe("POST /delete", () => {
//     test("Respone With A 200 Status Code", async () => {
//         const loginRespone = await request(server).post('/api/authentication/login').send({
//             email: 'nthedao2705@gmail.com',
//             passWord: '2705'
//         })

//         expect(loginRespone.statusCode).toBe(200)

//         const { data } = loginRespone.body

//         const productListRespone = await request(server).post('/api/product/delete/' + 1)
//                                             .set({'Authorization': data.accessToken})

//         expect(productListRespone.statusCode).toBe(200) 
//     })
// })