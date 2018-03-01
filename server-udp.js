const listener = require('./udp-listener')(onPacket)

listener.listen(8081)

function onPacket(data,PORT){
	console.log('UDP => ',data)
}