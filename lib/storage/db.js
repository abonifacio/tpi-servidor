const mongoose = require('mongoose')

const dispositivoSchema = new mongoose.Schema({
    nombre:String,
    mac:String,
    sampleRate:String,
    sampleSize:String,
    stereo:Boolean,
    creado: { type: Date, default: Date.now }
})

const Dispositivo = mongoose.model('Dispositivo', dispositivoSchema)
mongoose.Promise = global.Promise

function Database(){

    this.connect = ()=>{
        mongoose.connect('mongodb://localhost/tpiservidor',{useMongoClient:true})
    }

    this.update = (dispositivo)=>{
        return Dispositivo.update({mac:dispositivo.mac}, { $set: {
             sampleRate: dispositivo.sampleRate,
             sampleSize: dispositivo.sampleSize,
             stereo: dispositivo.stereo
        }})
    }

    this.get = (mac)=>{
        return Dispositivo.findOne({mac:mac})
    }

    this.save = (dispositivo)=>{
        return Dispositivo.findOne({mac:dispositivo.mac})
        .then((e)=>{
            if(e) {
                e.sampleRate = dispositivo.sampleRate
                e.sampleSize = dispositivo.sampleSize
                e.stereo = dispositivo.stereo
                return e.save()
            }
            return (new Dispositivo(dispositivo)).save().then((r)=>{
                r.created = true
                return r
            })
        })
        .then((e)=>{
            e.puerto = dispositivo.puerto
            return e
        })
    }

    this.getAll = ()=>{
        return Dispositivo.find({},'nombre mac sampleRate sampleSize stereo creado').limit(20)
    }

}

module.exports = new Database()