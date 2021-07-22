const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

const server = express()

server.use(morgan('dev'))
server.use(bodyParser.json())
server.use(cors())

module.exports = server
