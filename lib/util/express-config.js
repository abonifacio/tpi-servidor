module.exports = function(dirname){
    const express = require('express')
    const log = require('./logger')
    const app = express()
    const bodyParser = require('body-parser')
    const ERROR_HEADER = 'Error-Message'
    app.use(bodyParser.json())
    app.use(Logger)
    app.use('/api',express.static(dirname + '/swagger'))
    app.use('/bower_components',express.static(dirname + '/bower_components'))
    app.use('/records',express.static(dirname + '/records'))
    app.use('/',express.static(dirname + '/public'))
    
    function Logger(req,res,next){
        let _log = /\/dispositivos.*/.test(req.url) ? log.info : log.ultraDebug
        _log('Request('+new Date().toLocaleString()+'): ',req.method,req.url)
        next()
    }
    function ErrorHandler(err,req,res,next){
        log.error('Interceptando error: ',err)
        res.set(ERROR_HEADER,err)
        res.status(500)
        res.send('')
    }
    setTimeout(()=>{
        app.use(ErrorHandler)
    })
    return app
}