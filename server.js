/**
 * Librerias
 */
const express = require('express');
const bodyParser = require('body-parser');
const spawn = require('child_process').spawn;
const app = express();

/**
 * Clases
 */ 
const conf = require('./conf');
const dispositivos = require('./dispositivos');
const listener = require('./udp-listener')(onPacket);
const sender = require('./udp-sender');
/**
 * Constantes
 */
const URI = '/dispositivos';
const ERROR_HEADER = 'Error-Message';
const PORT = conf.port;

app.use(bodyParser.json());
app.use(Logger);

function onPacket(data,PORT){
	try{
		const disp = dispositivos.get(PORT);
		disp.subscribers.forEach(function(IP) {
			copyAndSend(data,IP,PORT)
		});
	}catch(err){
		console.error(err);
	}
}

function copyAndSend(data,ip,port){
	const buffer = Buffer.from(data);
	sender.send(data,port,ip);
	console.log('Se envio a ',ip);
}

app.get(URI, function (req, res) {
	res.send(dispositivos.get());
});

app.post(URI, function (req, res) {
	const puerto = dispositivos.add(req.body);
	listener.listen(puerto);
	res.send(String(puerto));
});

app.put(URI,function(req,res){
	dispositivos.subscribe(req.body.puerto,req.body.ip);
	res.status(200).send(null);
});

app.use(ErrorHandler);

function Logger(req,res,next){
	console.log('Request: ',req.method,req.url);
	next();
}
function ErrorHandler(err,req,res,next){
	console.log('Interceptando error: ',err);
	res.set(ERROR_HEADER,err);
	res.status(500);
	res.send(null);
}

app.listen(80,function(){
	console.log('Server corriendo');
});
