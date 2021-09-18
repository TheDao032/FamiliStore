const server = require('./server')
const environment = require('./environments/environment')
const schedule = require('./schedule')

server.listen(environment.portServer, () => {
	console.log(`Server Is Starting`)
})