// const request = require('supertest');

// const server = require('../server')
// const knex = require('../utils/dbConnection')

// describe("POST /add", () => {
//     test("Respone With A 200 Status Code", async () => {
//         const loginRespone = await request(server).post('/api/authentication/login').send({
//             email: 'nthedao2705@gmail.com',
//             passWord: '2705'
//         })

//         expect(loginRespone.statusCode).toBe(200)

//         const { data } = loginRespone.body

//         const billListRespone = await request(server).post('/api/bill/add')
//                                             .set('Authorization', data.accessToken)
//                                             .send({
//                                                 accId: 26,
//                                                 totalPrice: "50000",
//                                                 totalQuantity: 4,
//                                                 listProduct: [
//                                                     {
//                                                         prodId: 1000,
//                                                         prodQuantity: 2
//                                                     }
//                                                 ]
//                                             })

//         expect(billListRespone.statusCode).toBe(200)
//     })
// })

// describe("GET /details", () => {
//     test("Respone With A 200 Status Code", async () => {
//         const loginRespone = await request(server).post('/api/authentication/login').send({
//             email: 'nthedao2705@gmail.com',
//             passWord: '2705'
//         })

//         expect(loginRespone.statusCode).toBe(200)

//         const { data } = loginRespone.body

//         const result = await knex('tbl_bill').where({ bill_account_id: 26 })
        
//         const billListRespone = await request(server).get('/api/bill/details/' + result[0].bill_id)
//                                             .set('Authorization', data.accessToken)

//         expect(billListRespone.statusCode).toBe(200)
//     })
// })

// describe("GET /history-bill", () => {
//     test("Respone With A 200 Status Code", async () => {
//         const loginRespone = await request(server).post('/api/authentication/login').send({
//             email: 'nthedao2705@gmail.com',
//             passWord: '2705'
//         })

//         expect(loginRespone.statusCode).toBe(200)

//         const { data } = loginRespone.body

//         const result = await knex('tbl_bill').where({ bill_account_id: 26 })

//         const billListRespone = await request(server).get('/api/bill/history-bill/' + result[0].bill_account_id)
//                                             .set('Authorization', data.accessToken) 

//         await knex('tbl_bill_detail').where({ bdetail_bill_id: result[0].bill_id }).del()
//         await knex('tbl_bill').where({ bill_id: result[0].bill_id }).del()

//         expect(billListRespone.statusCode).toBe(200)
//     })
// })

// describe("POST /update-status", () => {
//     test("Respone With A 200 Status Code", async () => {
//         const loginRespone = await request(server).post('/api/authentication/login').send({
//             email: 'nthedao2705@gmail.com',
//             passWord: '2705'
//         })

//         expect(loginRespone.statusCode).toBe(200)

//         const { data } = loginRespone.body

//         const billListRespone = await request(server).post('/api/bill/update-status')
//                                             .set('Authorization', data.accessToken)
//                                             .send({
//                                                 billId: 1000,
//                                                 status: "transported"
//                                             })

//         expect(billListRespone.statusCode).toBe(200)
//     })
// })