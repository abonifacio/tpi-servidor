const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const fs = require('fs');
const conf = require('../conf');
const SerialPort = require('serialport');
const ByteLength = SerialPort.parsers.ByteLength;
const portName = '\\\\.\\COM6';

const HOST = conf.host;


function abrirSerie(PORT){

    const BUFF_SIZE = 63*1024
    let BUFF = Buffer.alloc(BUFF_SIZE)
    let written = 0

    let sp = new SerialPort(portName, {
        baudRate: 460800,
        dataBits: 8,
        parity: 'none',
        stopBits: 1,
        flowControl: false
    });
    const parser = sp.pipe(new ByteLength({length: 4}));
    parser.on('data',function(data){
        let len = data.byteLength;
        if(written+len>BUFF_SIZE){
            client.send(data,0,data.byteLength,PORT,HOST,function(err,bytes){
                if (err) throw err;
                console.log('paquete a ' + HOST +':'+ PORT);
                BUFF = Buffer.alloc(BUFF_SIZE);
                written = 0;
            });
        }else{
            BUFF.write(data)
            written+= len
        }
    });
}

module.exports = abrirSerie;