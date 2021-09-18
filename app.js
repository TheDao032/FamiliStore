const server = require('./server')
const environment = require('./environments/environment')
const scheduledJob = require('./schedule') // run schedule

server.listen(environment.portServer, () => {
	console.log(`Server Is Starting`)
})