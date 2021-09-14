const request = require('supertest')

const server = require('../server')

describe("GET /list", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

        const accountListRespone = await request(server).get('/api/account/list')
                                            .set('Authorization', data.accessToken)

        expect(accountListRespone.statusCode).toBe(200)
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

        const accountListRespone = await request(server).get('/api/account/details/' + data.user.accId)
                                            .set('Authorization', data.accessToken)

        expect(accountListRespone.statusCode).toBe(200)
    })
})
/*
describe("POST /update", () => {
    test("Respone With A 200 Status Code", async () => {
        const loginRespone = await request(server).post('/api/authentication/login').send({
            email: 'nthedao2705@gmail.com',
            passWord: '2705'
        })

        expect(loginRespone.statusCode).toBe(200)

        const { data } = loginRespone.body

        const accountListRespone = await request(server).post('/api/account/update')
                                            .set('Authorization', data.accessToken)
                                            .send({
                                                accId: data.user.accId
                                            })

        expect(accountListRespone.statusCode).toBe(200)
    })
})
*/
// describe("POST /update-password", () => {
//     test("Respone With A 200 Status Code", async () => {
//         const loginRespone = await request(server).post('/api/authentication/login').send({
//             email: 'nthedao2705@gmail.com',
//             passWord: '2705'
//         })

//         expect(loginRespone.statusCode).toBe(200)

//         const { data } = loginRespone.body

//         const accountListRespone = await request(server).post('/api/account/update-password')
//                                             .set('Authorization', data.accessToken)
//                                             .send({
//                                                 accId: data.user.accId,
//                                                 accOldPassword: '2705',
//                                                 accNewPassword: '2705',
//                                                 accConfirmPassword: '2705'
//                                             })

//         expect(accountListRespone.statusCode).toBe(200)
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

        const id = 26

        const accountListRespone = await request(server).post('/api/account/delete/' + id)
                                            .set('Authorization', data.accessToken)

        expect(accountListRespone.statusCode).toBe(200)
    })
})
