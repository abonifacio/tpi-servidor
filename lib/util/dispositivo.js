function Dispositivo({nombre,mac,sampleRate,sampleSize,stereo},puerto,files){
    this.nombre = nombre
    this.mac = mac
    this.sampleRate = sampleRate || 22000
    this.sampleSize = sampleSize || 8
    this.stereo = stereo || false
    this.puerto = puerto
    this.files = files || []

    this.subscribers = []

    this.subscribe = (IP)=>{
        const i = this.subscribers.indexOf(IP)
        if(i>-1){
            this.subscribers.splice(i,1)
        }else{
            this.subscribers.push(IP)
        }
        return this.sampleRate
    }

}

module.exports = Dispositivo