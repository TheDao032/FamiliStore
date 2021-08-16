const server = require('./server')
const environment = require('./environments/environment')

server.listen(environment.portServer, () => {
	console.log(`Server Is Starting`)
})