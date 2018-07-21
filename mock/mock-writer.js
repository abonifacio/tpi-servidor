const wav = require('wav')
const spawn = require('child_process').spawn

const writer = new wav.Writer({sampleRate: 44100,channels: 2, bitDepth:16})
writer.pipe(require('fs').createWriteStream('../tmp/test_output.wav'))


const rec = spawn('fmedia',['--record','--rate=44100','--channels=stereo','--format=int16','-o','@stdout.wav'])
let count = 0
rec.stdout.on('data',function(data){
    writer.write(data)
    count++
    console.log('count: ',count)
})