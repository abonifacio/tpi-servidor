const log = require('../util/logger')

function UDP(onPacket){
    
    const listener = require('./listener')(onPacket)
    const sender = require('./sender')
    
    this.broadcast = (data,disp) =>{
        log.ultraDebug('UDP => ',Buffer.byteLength(data))
        try{
            disp.subscribers.forEach(function(IP) {
                copyAndSend(data,IP,disp.puerto)
            })
        }catch(err){
            log.error(err)
        }
    }
    
    function copyAndSend(data,ip,port){
        sender.send(data,port,ip)
        log.debug('Se reenvio a ',ip,Buffer.byteLength(data),' bytes')
    }

    this.listen = (PORT) =>{
        listener.listen(PORT)
    }

}

module.exports = (onPacket) => new UDP(onPacket)