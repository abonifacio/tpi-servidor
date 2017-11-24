const listener = require('./udp-listener')(onData);


function onData(data){
    console.log('UDP',data.toString('hex'));
}

listener.listen(8080);