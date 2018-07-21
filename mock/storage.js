const st = require('../storage')(()=>{},true)
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

// const file = fs.createReadStream('../tmp/1519657456447.test')
if(process.argv.indexOf('-r')>-1){
    const output = fs.createWriteStream('../tmp/read-out.test')
    st.pipeAudioStream(output,disp.mac)
    console.log('leyendo')
}else{
    console.log('escrbiendo')
    for(let i = 0; i<100;i++){
        st.buffer(Buffer.from(("00" + i).slice(-3)+'\n'),disp.mac)
    }
    st.clear(disp.mac)
}