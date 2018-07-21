/**
 * Librerias
 */
const app = require('./lib/util/express-config')(__dirname)
const http = require('http').Server(app)
const io = require('socket.io')(http)

/**
 * Clases
 */ 
const log = require('./lib/util/logger')
const udp = require('./lib/udp')(onPacket)
const storage = require('./lib/storage')

function onPacket(data,PORT){
	const disp = storage.get(PORT)
	if(disp){
		udp.broadcast(data,disp)
		storage.buffer(data,disp)
	}else{
		log.warning(`Llego un paquete al puerto ${PORT} y no hay dispositivo registrado en ese puerto`)
	}
}


app.get('/dispositivos', function (req, res,next) {
	storage.listDispositivos(req.query.all).then((data)=>{
		res.send(data)
	}).catch(next)
})

app.post('/dispositivos', function (req,res,next) {
	log.debug('Llego: ',req.body)
	storage.add(req.body).then((data)=>{
		log.debug('Devolviendo puerto... ',data.puerto)
		if(data.created){
			io.sockets.emit('nuevo',data)
		}
		udp.listen(data.puerto)
		res.send(String(data.puerto))
	}).catch(next)
})

app.put('/dispositivos',function(req,res,next){
	res.send(String(storage.subscribe(req.body.mac,req.body.ip)))
})

app.get('/dispositivos/:mac',function(req,res,next){
	const mac = req.params.mac
	storage.withFiles(mac).then((data)=>{
		res.send(data)
	}).catch(next)
})

app.delete('/dispositivos/:mac',function(req,res){
	storage.remove(req.params.mac)
	res.status(200).send(null)
})

http.listen(80,function(){
	log.info('Server corriendo http://localhost/')
})
