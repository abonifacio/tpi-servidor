

function Dispositivos(){
    var LIST = [];
    // const LIST = [
    //     {ip:"192.168.0.37",nombre:"CIAA",puerto:8081,subscribers:[]},
    //     {ip:"192.168.0.45",nombre:"MIC",puerto:8082,subscribers:[]},
    // ];
    
    function getNextPort(){
        var max = 8080;
        LIST.forEach(function(disp){
            if(disp.puerto > 8080){
                max = disp.puerto;
            }
        });
        return max+1;
    }

    function getByPort(port){
        var i;
        for(i=0;i<LIST.length;i++){
            if(LIST[i].puerto==port){
                return LIST[i];
            }
        }
        return undefined;
    }

    function getByMac(MAC){
        var i;
        for(i=0;i<LIST.length;i++){
            if(LIST[i].mac==MAC){
                return LIST[i];
            }
        }
        return undefined;
    }

    this.add = function(disp){
        if(!disp) throw "El dispositivo es nulo";
        if(!disp.mac) throw "El dispositivo no tiene MAC adress";
        let existente = getByMac(disp.mac);
        if(existente) return existente;
        if(!disp.ip) throw "El dispositivo no tiene IP";
        if(!disp.nombre) throw "El dispositivo no tiene nombre";
        if(!disp.sampleRate) throw "El dispositivo no specifica frecuencia de muestreo";
        if(!disp.sampleSize) throw "El dispositivo no specifica tamano de muestra";
        if(!disp.stereo) disp.stereo = false;
        disp.puerto = getNextPort();
        disp.subscribers = [];
        LIST.push(disp);
        return disp;
    }

    this.get = function(portOrMac){
        if(portOrMac && typeof portOrMac === 'string'){
            const tmp = getByMac(portOrMac);
            if(!tmp) throw "No se encontro la mac "+portOrMac;
            return tmp;
        }else if(portOrMac){
            const tmp = getByPort(portOrMac);
            if(!tmp) throw "No se encontro el puerto "+portOrMac;
            return tmp;
        }
        return LIST;
    }

    this.subscribe = function(MAC,IP){
        const disp = getByMac(MAC);
        if(!disp) throw "No existe el dispositivo";
        const index = disp.subscribers.indexOf(IP);
        if(index>-1){
            disp.subscribers.splice(index,1);
        }else{
            disp.subscribers.push(IP);
        }
    }

    this.remove = function(MAC){
        var i;
        var index = undefined;
        for(i=0;i<LIST.length;i++){
            if(LIST[i].mac==MAC){
                index = i;
                break;
            }
        }
        if(index==undefined) throw "El puerto no está registrado";
        LIST.splice(index,1);
    }
}



module.exports = new Dispositivos();