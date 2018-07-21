const PENDING_TASKS = []

let lastPromise = null

function next(){
    if(PENDING_TASKS.length){
        return process(PENDING_TASKS.shift())
    }
    return Promise.resolve()
}

function process({fn,cb = ()=>{}}){
    return fn().then(()=>{
        return next()
    })
}

function add(fn,cb){
    PENDING_TASKS.push({fn:fn,cb:cb})
    if(lastPromise){
        lastPromise.then(next)
    }else{
        lastPromise = next()
    }
}

module.exports = {add:add}