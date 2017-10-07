

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

    function getByIp(IP){
        var i;
        for(i=0;i<LIST.length;i++){
            if(LIST[i].ip==IP){
                return LIST[i];
            }
        }
        return undefined;
    }

    this.add = function(disp){
        if(!disp) throw "El dispositivo es nulo";
        if(!disp.ip) throw "El dispositivo no tiene IP";
        if(!disp.nombre) throw "El dispositivo no tiene nombre";
        if(getByIp(disp.ip)) throw "La ip ya se encuentra registrada";
        disp.puerto = getNextPort();
        disp.subscribers = [];
        LIST.push(disp);
        return disp.puerto;
    }

    this.get = function(port){
        if(port){
            const tmp = getByPort(port);
            if(!tmp) throw "No se encontro el puerto "+port;
            return tmp;
        }
        return LIST;
    }

    this.subscribe = function(PORT,IP){
        const disp = getByPort(PORT);
        if(!disp) throw "No hay dispositivo en ese puerto";
        disp.subscribers.push(IP);
    }
}



module.exports = new Dispositivos();