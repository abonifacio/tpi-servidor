const st = require('../storage')(()=>{})
const fs = require('fs')

const disp = {
    nombre:'STTEST',
    ip:'192.23.24.4',
    mac:'1312:13123:12312329876',
    sampleRate:44100,
    sampleSize:16,
    stereo:true
}

st.init(disp);

const file = fs.createReadStream('../tmp/1519657456447.test')
// const output = fs.createWriteStream('../tmp/read-out.test')

file.on('data',function(bytes){
    st.buffer(bytes,disp.mac)
})
