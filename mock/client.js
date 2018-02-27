const mockSender = require('./mock-sender2');
// const mockSender = require('./mock-mic');
const os = require('os');
const http = require('http');
const conf = require('../conf');

function getIp(){
    var interfaces = os.networkInterfaces();
    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                return address.address;
            }
        }
    }   
}

function getMac(){
    var interfaces = os.networkInterfaces();
    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                return address.mac;
            }
        }
    }   
}

const args = process.argv;

if(args.length>2){
    const disp = {
        nombre:args[2],
        ip:getIp(),
        mac:getMac()+args[2],
        sampleRate:31000,
        sampleSize:8,
        stereo:false
        // sampleRate:44100,
        // sampleSize:16,
        // stereo:true
    }

    const req = http.request({
        host:conf.host,
        method:'POST',
        path:'/dispositivos',
        headers:{
            'Content-Type':'application/json'
        }
    },function(res){
        res.on('data',function(body){
            const puerto = parseInt(body);
            console.log(puerto);
            mockSender(puerto);
        });
    });
    req.write(JSON.stringify(disp));
    req.end();

}else{
    mockSender(8081);
}
