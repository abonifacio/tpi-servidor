const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const conf = require('./conf');
const spawn = require('child_process').spawn;

const HOST = conf.host;

function start(PORT){

	// const rec = spawn('arecord',['-f','cd']); // linux
	const rec = spawn('fmedia',['--record','-o','@stdout.wav']); //windows

	rec.stdout.on('data',function(data){
		client.send(data,0,data.byteLength,PORT,HOST,function(err,bytes){
		    if (err) throw err;
		    console.log('paquete a ' + HOST +':'+ PORT);
		});
	});
}



module.exports = start;

