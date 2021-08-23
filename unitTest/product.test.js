const request = require('supertest')

const fs = require('fs')
const randomstring = require('randomstring')

const server = require('../server')
const knex = require('../utils/dbConnection')
const productModel = require('../models/product.model')
const categoriesModel = require('../models/categories.model')

describe("POST /list", () => {
    test("Respone With A 200 Status Code", async () => {
        const productListRespone = await request(server).post('/api/product/list')
                                            .send({
                                                page: 1,
                                                limit: 2
                                            })

        expect(productListRespone.statusCode).toBe(200) 
    })
})

describe("POST /list-suggestion", () => {
    test("Respone With A 200 Status Code", async () => {
        const allProduct = await productModel.findAll()

        const productListRespone = await request(server).post('/api/product/list-suggestion')
                                            .send({
                                                page: 1,
                                                limit: 2,
                                                catID: allProduct[0].prod_category_id
                                            })

        expect(productListRespone.statusCode).toBe(200) 
    })
})

describe("POST /list-by-cat", () => {
    test("Respone With A 200 Status Code", async () => {
        const allProduct = await productModel.findAll()

        const productListRespone = await request(server).post('/api/product/list-by-cat')
                                            .send({
                                                page: 1,
                                                limit: 2,
												catID: allProduct[0].prod_category_id
                                            })

        expect(productListRespone.statusCode).toBe(200) 
    })
})

describe("GET /details", () => {
    test("Respone With A 200 Status Code", async () => {
        const allProduct = await productModel.findAll()

        const productListRespone = await request(server).get('/api/product/details/' + allProduct[0].prod_id)

        expect(productListRespone.statusCode).toBe(200) 
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
		const allCategories = await categoriesModel.findAll()
        const allProduct = await productModel.findAll()
		let newProductName = randomstring.generate(60)
	    let checkExist = allProduct.find((info) => (info.prod_name.toLowerCase() === newProductName.toLowerCase()))
        
        while (checkExist) {
            newProductName = randomstring.generate(60)
            checkExist = allProduct.find((info) => (info.prod_name.toLowerCase() === newProductName.toLowerCase()))
        }

        const productListRespone = await request(server).post('/api/auth-product/add')
                                            .set({'Authorization': data.accessToken})
                                            .send({
                                                prodName: newProductName,
                                                prodCategoryID: allCategories[0].cate_id,
                                                prodAmount: 10,
                                                prodPrice: 1000,
                                                prodDescription: 'test_product'
                                            })

        expect(productListRespone.statusCode).toBe(200) 
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
        const allCategories = await categoriesModel.findAll()
        const allProduct = await productModel.findAll()
        
        let newProductName = randomstring.generate(60)
        let checkExist = allProduct.find((info) => (info.prod_name.toLowerCase() === newProductName.toLowerCase()))
        
        while (checkExist) {
            newProductName = randomstring.generate(60)
            checkExist = allProduct.find((info) => (info.prod_name.toLowerCase() === newProductName.toLowerCase()))
        }

        const productListRespone = await request(server).post('/api/auth-product/update/' + allProduct[0].prod_id)
                                            .set({'Authorization': data.accessToken})
                                            .send({
                                                prodName: newProductName,
                                                prodCategoryID: allCategories[0].cate_id
                                            })

        expect(productListRespone.statusCode).toBe(200) 
    })
})

// describe("POST /update-image", () => {
//     test("Respone With A 200 Status Code", async () => {
//         const loginRespone = await request(server).post('/api/authentication/login').send({
//             email: 'nthedao2705@gmail.com',
//             passWord: '2705'
//         })

//         expect(loginRespone.statusCode).toBe(200)

//         const { data } = loginRespone.body

//         const productListRespone = await request(server).post('/api/auth-product/update-image/' + 3)
//                                             .set({'Authorization': data.accessToken})
//                                             .field('content-type', 'multipart/form-data')
//                                             .attach('images', fs.readFileSync(`test/product100.png`), 'test/product100.png')

//         expect(productListRespone.statusCode).toBe(200) 
//     })
// })

describe("POST /delete", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

        const allProduct = await productModel.findAll()

        const productListRespone = await request(server).post('/api/auth-product/delete/' + allProduct[0].prod_id)
                                            .set({'Authorization': data.accessToken})

        expect(productListRespone.statusCode).toBe(200) 
    })
})
