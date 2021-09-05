var environment = process.env.NODE_ENV || 'development'
var config = require('../knexfile.js')[environment]

const knex = require('knex')(config)

module.exports = knex

