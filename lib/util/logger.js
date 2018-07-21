const conf = require('../../conf')
const LEVELS = {ultraDebug:-1,debug:0,info:1,warning:2,error:3}

function log(args,color){
    console.log.apply(this,[color].concat(Array.from(args)).concat(['\x1b[0m']))
}


function is(level){
    return LEVELS[conf.logLevel] <= LEVELS[level]
}

module.exports = {
    ultraDebug: function(){ is('ultraDebug') && log(arguments,'\x1b[37m')},
    debug: function(){ is('debug') && log(arguments,'\x1b[32m')},
    info: function(){ is('info') && log(arguments,'\x1b[36m')},
    warning: function(){ is('warning') && log(arguments,'\x1b[33m')},
    error: function(){ is('error') && log(arguments,'\x1b[31m')}
}