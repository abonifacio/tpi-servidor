function Ports(){
    let inUse = {}
    let currentPort = 8080
    
    this.register = (mac)=>{
        inUse[mac] = ++currentPort
        return currentPort
    }

    this.exists = (mac) =>{
        return inUse[mac]!==undefined
    }
    this.remove = (mac) =>{
        delete inUse[mac]
    }
}

module.exports = new Ports()