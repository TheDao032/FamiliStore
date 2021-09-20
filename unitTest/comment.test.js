const request = require('supertest');

const server = require('../server')
const knex = require('../utils/dbConnection')

const productModel = require('../models/product.model')
const commentModel = require('../models/comment.model')

let staticComment

describe("POST /list", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body
		const allProducts = await productModel.findAll()

        const categoryListRespone = await request(server).post('/api/comment/list')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                productID: allProducts[0].prod_id,
                                                page: 1,
                                                limit: 2
                                            })

        expect(categoryListRespone.statusCode).toBe(200)
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
// 		const allProducts = await productModel.findAll()

//         const randomNumber = Math.floor(Math.random() * (0 + allProducts.length))

//         const categoryListRespone = await request(server).post('/api/comment/add')
//                                             .set('Authorization', data.accessToken)
//                                             .send({
//                                                 productID: allProducts[randomNumber].prod_id,
//                                                 content: 'test_content',
//                                                 vote: 2
//                                             })
//         const { cmtId } = categoryListRespone.body
//         staticComment = cmtId

//         expect(categoryListRespone.statusCode).toBe(200)
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

//         const categoryListRespone = await request(server).post('/api/comment/update')
//                                             .set('Authorization', data.accessToken)
//                                             .send({
//                                                 commentID: staticComment,
//                                                 content: 'test_content',
//                                                 vote: 3
//                                             })

//         expect(categoryListRespone.statusCode).toBe(200)
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
        
//         const categoryListRespone = await request(server).post('/api/comment/delete')
//                                             .set('Authorization', data.accessToken)
//                                             .send({
//                                                 commentID: staticComment
//                                             })

//         expect(categoryListRespone.statusCode).toBe(200)
//     })
// })
