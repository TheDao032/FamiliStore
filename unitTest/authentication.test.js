const request = require('supertest');

const server = require('../server')

describe("POST /login", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post("/api/authentication/login").send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)
    })
})