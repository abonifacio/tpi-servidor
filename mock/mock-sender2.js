const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const fs = require('fs');
const conf = require('../conf');

const HOST = conf.host;
const BYTE_RATE = conf.byte_rate;
const KBPS = conf.kbps;
// const KBPS = 31000;


function abrirArchivo(PORT){

	const INTERVAL	= BYTE_RATE / (KBPS * 1024 / 8) * 1000;

    console.log('intevarlo: ',INTERVAL);
    
    // let audioBytes = fs.readFileSync('../tmp/testeo.txt')
    let audioBytes = fs.readFileSync('../tmp/MUESTRA-PM.wav')
    let len = audioBytes.byteLength
    let offset = 0

    function read(){
        let data
        if(offset+BYTE_RATE>=len){
            data = audioBytes.slice(offset)
            offset = 0
        }else{
            data = audioBytes.slice(offset,offset+BYTE_RATE)
            offset+=BYTE_RATE
        }

        client.send(data,0,data.byteLength,PORT,HOST,function(err,bytes){
		    if (err) throw err;
		    console.log('paquete a ' + HOST +':'+ PORT);
		});
    }

    setInterval(read,INTERVAL);

}

module.exports = abrirArchivo;