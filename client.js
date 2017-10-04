const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const fs = require('fs');
const conf = require('./conf');

const HOST = conf.host;
const PORT = conf.port;
const BYTE_RATE = conf.byte_rate;
const BPS = conf.bps;


function abrirArchivo(){
	const readStream = fs.createReadStream('tmp/queen.wav',{ highWaterMark: BYTE_RATE });
	
	const INTERVAL	= BYTE_RATE / BPS * 1000;

	readStream.on('data',function(data){
		client.send(data,0,data.byteLength,PORT,HOST,function(err,bytes){
		    if (err) throw err;
		    console.log('UDP message sent to ' + HOST +':'+ PORT);
		    readStream.pause();
		    setTimeout(function(){
		    	readStream.resume();
		    },INTERVAL);
		});
	});
	readStream.on('end',function(){
		abrirArchivo();
	});
}

client.on('listening',function(){

	client.setBroadcast(true);
	abrirArchivo();
});

client.bind();

