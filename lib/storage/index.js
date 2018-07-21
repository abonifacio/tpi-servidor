const wavFiles = require('./wav')
const db = require('./db')
const ports = require('./ports')
const Dispositivo = require('../util/dispositivo')
const log = require('../util/logger')
const conf = require('../../conf')

function Storage(){

    if(conf.db){
        db.connect()
    }
    
    let MEMORY_LIST = []
    
    function getByPort(port){
        return MEMORY_LIST.find(d => d.puerto==port)
    }
    
    function getByMac(MAC){
        return MEMORY_LIST.find(d => d.mac==MAC)
    }

    this.add = (disp)=>{
        if(!disp) throw "El dispositivo es nulo"
        if(!disp.mac) throw "El dispositivo no tiene MAC adress"
        if(!disp.nombre) throw "El dispositivo no tiene nombre"
        if(ports.exists(disp.mac)){
            let ex = getByMac(disp.mac)
            ex.sampleRate = disp.sampleRate
            ex.sampleSize = disp.sampleSize
            ex.stereo = disp.stereo
            log.debug('Dispositivo existente: ',ex)
            if(conf.db){
                return db.update(ex)
            }
            return Promise.resolve(ex)
        }
        let nw = new Dispositivo(disp,ports.register(disp.mac))
        MEMORY_LIST.push(nw)
        log.debug('Creado dispositivo...')
        let promises = []
        if(conf.db){
            log.debug('Guardando dispositivo...')
            promises.push(db.save(nw))
        }
        if(conf.wav){
            log.debug('Creando carpeta...')
            promises.push(wavFiles.init(nw).then(()=>nw))
        }
        if(!promises.length) return Promise.resolve(nw)
        return Promise.all(promises).then((data)=>data[0])
    }

    this.listDispositivos = function(all){
        if(all && conf.db){
            return db.getAll()
        }
        return Promise.resolve(MEMORY_LIST)
    }

    this.withFiles = function(mac){
        let files = getFiles()
        let d = getDispositivo()
        return Promise.all([d,files]).then(([disp,files])=>{
            if(!disp) return Promise.reject('No existe el dispositivo')
            return new Dispositivo(disp,disp.puerto,files)
        })
        function getFiles(){
            if(conf.wav){
                return wavFiles.getFiles(mac)
            }
            return Promise.resolve([])
        }
        function getDispositivo(){
            if(conf.db){
                return db.get(mac)
            }else{
                return Promise.resolve(getByMac(mac))
            }
        }
    }

    this.get = function(port){
        return getByPort(port)
    }

    this.subscribe = function(MAC,IP){
        const disp = getByMac(MAC)
        if(!disp) throw "No existe el dispositivo"
        return disp.subscribe(IP)
    }

    this.buffer = (bytes,dispositivo)=>{
        if(conf.wav){
            wavFiles.buffer(bytes,dispositivo)
        }
    }
    
    this.remove = function(MAC){
        ports.remove(MAC)
        if(conf.wav){
            wavFiles.end(MAC)
        }
        MEMORY_LIST = MEMORY_LIST.filter(d=>d.mac!=MAC)
    }
}


module.exports = new Storage()