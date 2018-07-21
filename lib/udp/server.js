const dgram = require('dgram')
const log = require('../util/logger')

function createServer(PORT,onData){
	const server = dgram.createSocket('udp4')
	server.on('error', (err) => {
	  server.close()
	})
	
	server.on('message',onData)

	server.on('listening', () => {
	  const address = server.address()
	  log.info('UDP server corriendo',address)
	})

	server.bind(PORT)

}

module.exports = createServer