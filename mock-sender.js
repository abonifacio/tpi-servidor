const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const fs = require('fs');
const conf = require('./conf');

const HOST = conf.host;
const BYTE_RATE = conf.byte_rate;
const KBPS = conf.kbps;


function abrirArchivo(PORT){
	const readStream = fs.createReadStream('tmp/queen.wav',{ highWaterMark: BYTE_RATE });
	

	const INTERVAL	= BYTE_RATE / (KBPS * 1024 / 8) * 1000;

	console.log('intevarlo: ',INTERVAL);

	readStream.on('data',function(data){
		client.send(data,0,data.byteLength,PORT,HOST,function(err,bytes){
		    if (err) throw err;
		    console.log('paquete a ' + HOST +':'+ PORT);
		    readStream.pause();
		    setTimeout(function(){
		    	readStream.resume();
		    },INTERVAL);
		});
	});
	readStream.on('end',function(){
		abrirArchivo(PORT);
	});
}

module.exports = abrirArchivo;