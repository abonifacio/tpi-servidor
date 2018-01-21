const mongoose = require('mongoose')
// const pcm = require('pcmjs')
const fs = require('fs');

mongoose.connect('mongodb://localhost/tpiservidor')
const audioSchema = new mongoose.Schema({
    bytes:  Buffer,
    mac:String,
    creado: { type: Date, default: Date.now },
})

const Audio = mongoose.model('Audio', audioSchema)

// const pcmP = new pcm({channels: 1, rate: 8000, depth: 8})

function getAudioStream(mac){
    const ws = fs.createWriteStream(`tmp/audio-${(new Date()).getTime()}.raw`)
    appendToStream(ws,mac,0)
}

function appendToStream(stream,mac,page){
    Audio.find({ mac : mac }).limit(100).exec((err,audios)=>{
        if(err) throw err
        audios.forEach((audio)=>{
            stream.write(audio.bytes,'binary')
        })
        if(audios.length<100){
            stream.end()
        }else{
            appendToStream(stream,mac,page+1)
        }
    })
}


getAudioStream('58:fb:84:5e:17:03CIAA3')