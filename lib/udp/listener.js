const server = require('./server')

function Listener(onData){

    return {
        listen: function(PORT){
            server(PORT,function(data,rInfo){
                onData(data,PORT)
            })
        }
    }
}

module.exports = Listener