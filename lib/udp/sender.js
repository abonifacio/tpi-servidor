const dgram = require('dgram')
const client = dgram.createSocket('udp4')



function Send(data,PORT,HOST){
    client.send(data,0,data.byteLength,PORT,HOST)
}



module.exports = {send : Send}