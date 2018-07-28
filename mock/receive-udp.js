const listener = require('../lib/udp/listener')(onData);


function onData(data){
    console.log('UDP',data.toString('hex'));
}

listener.listen(1234);