const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const server = express()

server.use(morgan('dev'))
server.use(bodyParser.json())

module.exports = server
