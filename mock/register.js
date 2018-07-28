const http = require('http')

function doRequest(){
    const disp = {
		sampleRate:11025,
		mac:'ab:cd:ef:12:34:56',
		nombre:'CIAA',
	}
    const req = http.request({
        host:'localhost',
        method:'POST',
        path:'/dispositivos',
        headers:{
            'Content-Type':'application/json'
        }
    })
    req.write(JSON.stringify(disp))
    req.end()
}

module.exports = doRequest