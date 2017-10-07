const mockSender = require('./mock-sender');
const os = require('os');
const http = require('http');
const conf = require('./conf');

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

const args = process.argv;

if(args.length>2){
    const disp = {
        nombre:args[2],
        ip:getIp()
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

}
