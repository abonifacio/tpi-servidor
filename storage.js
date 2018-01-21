const mongoose = require('mongoose')
const fs = require('fs')

mongoose.connect('mongodb://localhost/tpiservidor')

const NUM_PAQ = 3

const dispositivoSchema = new mongoose.Schema({
    nombre:String,
    mac:String,
    sampleRate:String,
    sampleSize:String,
    stereo:Boolean,
    creado: { type: Date, default: Date.now }
})

const audioSchema = new mongoose.Schema({
    bytes:  Buffer,
    mac:String,
    creado: { type: Date, default: Date.now },
})

const Audio = mongoose.model('Audio', audioSchema)
const Dispositivo = mongoose.model('Dispositivo', dispositivoSchema)

const BUFFERS = {}

function Storage(notifyNewRecord){


    function save(dispositivo,callback){
        const a = new Audio()
        a.bytes = dispositivo.bytes
        a.mac = dispositivo.mac
        a.save(onFinish)
        
        function onFinish(){
            dispositivo.bytes = Buffer.allocUnsafe(dispositivo.size)
            console.log(`Bytes para ${dispositivo.nombre} guardados: ${dispositivo.written}`)
            dispositivo.written = 0
            callback(dispositivo)
        }
    }
    
    function pipeAudioStream(stream,mac){
        appendToStream(stream,mac,0)
    }

    function appendToStream(stream,mac,page){
        Audio.find({ mac : mac }).skip(page).limit(100).exec((err,audios)=>{
            if(err) throw err
            audios.forEach((audio)=>{
                stream.write(audio.bytes)
            })
            if(audios.length<100){
                stream.end()
            }else{
                appendToStream(stream,mac,page+1)
            }
        })
    }
    
    function buffer(bytes,MAC){
        const disp = BUFFERS[MAC]
        // console.log(`BufSize: ${disp.size}, Written: ${disp.written}, bytes: ${bytes.length}`)
        if(disp.size==-1){
            onFirstPaquet(bytes,disp)
        }else if(disp.size<disp.written+bytes.length){
            // console.log(disp.size,'<<',disp.written+bytes.length)
            save(disp,function(nuevo){
                nuevo.written += bytes.copy(disp.bytes)
            })
        }else{
            // console.log(`buffereados: ${bytes.length}`)
            disp.written += bytes.copy(disp.bytes)
        }
    }
    
    function init(dispositivo){
        // BUFFER_SIZE = SEGUNDOS * SAMPLE_RATE * BYTES_POR_MUESTRA * CANALES
        BUFFERS[dispositivo.mac] = {
            nombre:dispositivo.nombre,
            mac:dispositivo.mac,
            size:-1,
            bytes:null,
            written:0
        }
        Dispositivo.findOne({mac:dispositivo.mac}).exec((err,disp)=>{
            if(!disp) saveDispositivo()
        })
        function saveDispositivo(){
            const d = new Dispositivo()
            d.mac = dispositivo.mac
            d.nombre = dispositivo.nombre
            d.sampleRate = dispositivo.sampleRate
            d.sampleSize = dispositivo.sampleSize
            d.stereo = dispositivo.stereo
            d.save()
            notifyNewRecord(d)
        }
    }
    
    function onFirstPaquet(bytes,dispositivo){
        dispositivo.size = NUM_PAQ * bytes.length
        dispositivo.bytes = Buffer.allocUnsafe(dispositivo.size)
        bytes.copy(dispositivo.bytes)
        dispositivo.written = bytes.length
    }
    
    function getAll(onData){
        Dispositivo.find({},'nombre mac sampleRate sampleSize stereo creado').limit(20).exec(function(err,audios){
            onData(audios)
        })    
    }
    
    function clear(MAC){
        const disp = BUFFERS[MAC]

        if(disp.written){
            save(disp,()=>{
                delete BUFFERS[MAC]
                
            })
        }
    }

    return {
        buffer:buffer,
        init:init,
        getAll:getAll,
        pipeAudioStream:pipeAudioStream,
        clear:clear
    }
}
    
module.exports = Storage