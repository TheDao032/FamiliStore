const request = require('supertest')
const randomstring = require('randomstring')

const server = require('../server')
const knex = require('../utils/dbConnection')

const cartModel = require('../models/cart.model')
const productModel = require('../models/product.model')

let staticCart

describe("GET /list", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

        const cartRespone = await request(server).get('/api/cart/list')
                                            .set('Authorization', data.accessToken)
                                            .query({
                                                page: 1,
                                                limit: 2
                                            })

        expect(cartRespone.statusCode).toBe(200)
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
        const allProducts = await productModel.findAll()

        const randomNumber = Math.floor(Math.random() * (0 + allProducts.length))

        

        const cartRespone = await request(server).post('/api/cart/add')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                prodId: allProducts[randomNumber].prod_id,
                                                cartAmount: 1
                                            })


        const { cartId } = cartRespone.body
        staticCart = cartId
        expect(cartRespone.statusCode).toBe(200)
    })
})

describe("POST /update-amount", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

        const categoryListRespone = await request(server).post('/api/cart/update-amount')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                cartId: staticCart,
                                                cartAmount: 3
                                            })

        expect(categoryListRespone.statusCode).toBe(200)
    })
})

describe("POST /check-price", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body
        const allProducts = await productModel.findAll()

        const listProduct = allProducts.map((item) => {
            return {
                prodId: item.prod_id,
                cartAmount: 2
            }
        })

        const categoryListRespone = await request(server).post('/api/cart/check-price')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                listProduct
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

        const categoryListRespone = await request(server).post('/api/cart/delete')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                cartId: staticCart
                                            })

        expect(categoryListRespone.statusCode).toBe(200)
    })
})