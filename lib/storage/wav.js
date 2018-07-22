const wav = require('wav')
const fs = require('fs')

const MAX_FILE_SIZE = 5*1024*1024
const BASE_PATH = './records/'

function getDir(mac){
    return (BASE_PATH+mac).replace(/:/g,'-')
}

function getFilename(mac){
    return (new Date()).toJSON().replace(/[:\.]/g,'-')+'.wav'
}

function getTitle(filename){
    return filename.replace(/T/g,' ').replace(/-\d+Z\.wav/g,'')
}

function createDir(path){
    return new Promise(function(resolve,reject){
        fs.mkdir(path,function(err){
            if(!err || (err && err.code === 'EEXIST')){
                resolve()
            } else {
                reject(err)
            }
        })
    })
}

function WavFile(dispositivo){
    const wavFolder = getDir(dispositivo.mac)
    
    let _writer
    let _lastFile 

    function resetFile(){
        let newFileName = getFilename()
        _writer = new wav.FileWriter(wavFolder+'/'+newFileName,{
            sampleRate: dispositivo.sampleRate,
            channels: dispositivo.stereo ? 2 : 1,
            bitDepth:dispositivo.sampleSize
        })
        _written = 0
        _lastFile = {
            name: getTitle(newFileName),
            path: (wavFolder+'/'+newFileName).substring(1)
        }
        return _lastFile
    }
    resetFile()

    this.lastFile = ()=>{
        return _lastFile
    }

    this.end = ()=>{
        _writer.end()
    }
    
    this.buffer = (bytes)=>{
        _writer.write(bytes)
        _written+=bytes.length
        if(_written>MAX_FILE_SIZE){
            _writer.end()
            return resetFile()
        }
    }
}

function WavFiles(){
    let WAVS = {}

    this.buffer = (bytes,dispositivo)=>{
        let writer = WAVS[dispositivo.mac]
        if(writer) {
            return writer.buffer(bytes)
        }
    }

    this.end = (mac)=>{
        let w = WAVS[mac]
        if(w){
            w.end()
            delete WAVS[mac]
        }
    }

    

    this.getFiles = (mac)=>{
        const cdir = getDir(mac)
        if(!fs.existsSync(cdir)) return Promise.reject('No existe el directorio')
        return new Promise(function(resolve,reject){
            fs.readdir(cdir, (err, files) => {
                if(err || !files) return reject(err)
                resolve(files.map(file=>({
                    path: (cdir+'/'+file).substring(1),
                    name: getTitle(file)
                })))
            })
        })
    }

    this.init = (dispositivo)=>{
        return createDir(getDir(dispositivo.mac)).then(()=>{
            WAVS[dispositivo.mac] = new WavFile(dispositivo)
            return WAVS[dispositivo.mac].lastFile()
        })
    }
}

module.exports = new WavFiles()