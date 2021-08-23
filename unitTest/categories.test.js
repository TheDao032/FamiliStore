const request = require('supertest')
const randomstring = require('randomstring')

const server = require('../server')
const knex = require('../utils/dbConnection')

const categoriesModel = require('../models/categories.model')

describe("GET /list", () => {
    test("Respone With A 200 Status Code", async () => {
        const categoryListRespone = await request(server).get('/api/categories/list')
                                            .query({
                                                page: 1,
                                                limit: 2
                                            })

        expect(categoryListRespone.statusCode).toBe(200)
    })
})

describe("GET /list-father", () => {
    test("Respone With A 200 Status Code", async () => {
        const categoryListRespone = await request(server).get('/api/categories/list-father')
                                            .query({
                                                page: 1,
                                                limit: 2
                                            })

        expect(categoryListRespone.statusCode).toBe(200)
    })
})

describe("POST /list-child", () => {
    test("Respone With A 200 Status Code", async () => {
        const allCategories = await categoriesModel.findFather()

        const categoryListRespone = await request(server).post('/api/categories/list-child')
                                            .query({
                                                page: 1,
                                                limit: 2
                                            })
                                            .send({
                                                cateFather: allCategories[0].cate_father,
                                            })

        expect(categoryListRespone.statusCode).toBe(200)
    })
})

describe("POST /add-father", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body
        const allCategories = await categoriesModel.findAll()
		let newCategoryName = randomstring.generate(60)
	    let checkExist = allCategories.find((info) => (info.cate_name.toLowerCase() === newCategoryName.toLowerCase()))
        
        while (checkExist) {
            newCategoryName = randomstring.generate(60)
            checkExist = allCategories.find((info) => (info.cate_name.toLowerCase() === newCategoryName.toLowerCase()))
        }

        const categoryListRespone = await request(server).post('/api/auth-categories/add-father')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                cateName: newCategoryName
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
        const allCategories = await categoriesModel.findAll()
		let newCategoryName = randomstring.generate(60)
	    let checkExist = allCategories.find((info) => (info.cate_name.toLowerCase() === newCategoryName.toLowerCase()))
        const allCategoriesFather = await categoriesModel.findFather()
        
        while (checkExist) {
            newCategoryName = randomstring.generate(60)
            checkExist = allCategories.find((info) => (info.cate_name.toLowerCase() === newCategoryName.toLowerCase()))
        }

        const categoryListRespone = await request(server).post('/api/auth-categories/add-child')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                cateName: newCategoryName,
                                                cateFather: allCategoriesFather[0].cate_father
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

        const allCategories = await categoriesModel.findAll()

        const cateId = allCategories[0].cate_id

		let newCategoryName = randomstring.generate(60)
	    let checkExist = allCategories.find((info) => (info.cate_name.toLowerCase() === newCategoryName.toLowerCase()) && (info.cate_id !== cateId))
        
        while (checkExist) {
            newCategoryName = randomstring.generate(60)
            checkExist = allCategories.find((info) => (info.cate_name.toLowerCase() === newCategoryName.toLowerCase()) && (info.cate_id !== cateId))
        }

        const categoryListRespone = await request(server).post('/api/auth-categories/update')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                cateId,
                                                cateName: newCategoryName
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

        const allCategories = await categoriesModel.findAll()
        
        const categoryListRespone = await request(server).post('/api/auth-categories/delete')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                cateId: allCategories[0].cate_id
                                            })
        
        expect(categoryListRespone.statusCode).toBe(200)
    })
})
