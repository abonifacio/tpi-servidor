/**
 * Librerias
 */
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

/**
 * Clases
 */ 
const conf = require('./conf')
const dispositivos = require('./dispositivos')
const listener = require('./udp-listener')(onPacket)
const sender = require('./udp-sender')
const storage = require('./storage')(onNewDispositivoSaved)

/**
 * Constantes
 */
const ERROR_HEADER = 'Error-Message'
const PORT = conf.port

app.use(bodyParser.json())
// app.use(Logger)

function onPacket(data,PORT){
	console.log('UDP => ',data)
	try{
		const disp = dispositivos.get(PORT)
		disp.subscribers.forEach(function(IP) {
			copyAndSend(data,IP,PORT)
		})
		storage.buffer(data,disp.mac)
	}catch(err){
		console.error(err)
	}
}

function onNewDispositivoSaved(dispositivo){
	io.sockets.emit('nuevo',dispositivo)
}

function copyAndSend(data,ip,port){
	const buffer = Buffer.from(data)
	sender.send(data,port,ip)
	console.log('Se envio a ',ip)
}

app.use('/api',express.static(__dirname + '/swagger'))
app.use('/bower_components',express.static(__dirname + '/bower_components'))
app.use('/',express.static(__dirname + '/public'))

app.get('/dispositivos', function (req, res) {
	res.send(dispositivos.get())
})

app.post('/dispositivos', function (req, res) {
	const disp = dispositivos.add(req.body)
	storage.init(disp)
	listener.listen(disp.puerto)
	res.send(String(disp.puerto))
})

app.put('/dispositivos',function(req,res){
	dispositivos.subscribe(req.body.mac,req.body.ip)
	const d = dispositivos.get(req.body.puerto)
	res.send(String(d.sample_rate))
})

app.delete('/dispositivos/:mac',function(req,res){
	const mac = req.params.mac
	dispositivos.remove(mac)
	storage.clear(mac)
	res.status(200).send(null)
})

app.get('/audios',function(req,res){
	storage.getAll(function(lista){
		res.status(200).send(lista)
	})
})

app.get('/audios/:mac',function(req,res){
	const mac = req.params.mac
	storage.pipeAudioStream(res,mac)
})


app.use(ErrorHandler)

function Logger(req,res,next){
	console.log('Request: ',req.method,req.url)
	next()
}
function ErrorHandler(err,req,res,next){
	console.log('Interceptando error: ',err)
	res.set(ERROR_HEADER,err)
	res.status(500)
	res.send(null)
}

http.listen(80,function(){
	console.log('Server corriendo http://localhost/')
})
