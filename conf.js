const config = {
	host : '192.168.0.37',
	// host : '10.0.137.160',
	port : 8080,
	db:true,
	logLevel:'info',
	mockRegister:false,
	wav:true,
	kbps: 1411,
	byte_rate:63*1024
}

function ifPresent(arg,key,val){
	if(process.argv.indexOf(arg)>-1){
		config[key] = val
	}
}

ifPresent('--no-db','db',false)
ifPresent('--no-wav','wav',false)
ifPresent('--ultra-debug','logLevel','ultraDebug')
ifPresent('--debug','logLevel','debug')
ifPresent('--warn','logLevel','warning')
ifPresent('--error','logLevel','error')
ifPresent('-r','mockRegister',true)

module.exports = config;