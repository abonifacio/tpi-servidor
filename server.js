const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const http = require('http');
const spawn = require('child_process').spawn;


// const aplay = spawn('aplay',['-r','8000',"-c", '6',"-f", "S16_BE"]);
const aplay = spawn('aplay');


server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {

	aplay.stdin.write(msg);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(8080);