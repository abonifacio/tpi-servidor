$(document).ready(function() { 
    $.material.init()
    
    const socket = io()
    
    $.ajax('/audios').done(addAll)
    
    socket.on('nuevo',function(dispositivo){
        addAll([dispositivo])
    })
    
    function addAll(dispositivo){
        const container =  $('#list-container')
        dispositivo.forEach((dispositivo)=>{
            const el = $(getTpl(dispositivo))
            el.click(()=>{
                openModal(dispositivo)
            })
            container.append(el)
        })    
    }
    
    function openModal(dispositivo,audio){
        const el = $('#modal')
        el.html(getModalInfo(dispositivo))
        el.find('.close-modal').click(()=>{
            $('#fondo').hide()
            el.hide(300)
        })
        el.find('#play-btn').click(()=>{
            $.ajax('/audios/'+dispositivo.mac)
            .done((audio)=>{
                downloadFile(audio,`audio-${dispositivo.nombre}.raw`)
            })
        })
        $('#fondo').show()
        el.show(300)
    }

    function downloadFile(data,filename){
        var blob = new Blob([data], { type: 'application/octet-stream' });                        
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
            //   IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
            window.navigator.msSaveBlob(blob, filename);
        } else {
            var URL = window.URL || window.webkitURL;
            var downloadUrl = URL.createObjectURL(blob);

            if (filename) { 
                // use HTML5 a[download] attribute to specify filename
                var a = document.createElement("a");

                // safari doesn't support this yet
                if (typeof a.download === 'undefined') {
                    window.location = downloadUrl;
                } else {
                    a.href = downloadUrl;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.target = "_blank";
                    a.click();
                }
            } else {
                window.location = downloadUrl;
            }
        }
    }

    function getTpl(dispositivo){
        return `
        <div id="item-${dispositivo.mac}" class="list-group-item" style="cursor:pointer">
            <div class="row-action-primary">
                <i class="material-icons">audiotrack</i>
            </div>
            <div class="row-content">
                <div class="least-content">${new Date(dispositivo.creado).toLocaleString()}</div>
                <h4 class="list-group-item-heading">${dispositivo.nombre}</h4>
            
                <p class="list-group-item-text">${dispositivo.mac}</p>
            </div>
        </div>
        <div class="list-group-separator"></div>
        `
    }

    function getModalInfo(dispositivo){
        return `
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close close-modal" aria-hidden="true">×</button>
                <h4 class="modal-title">${dispositivo.nombre} - ${dispositivo.mac}</h4>
            </div>
            <div class="modal-body">
                <p>Frecuencia de muestreo: ${dispositivo.sampleRate}</p>
                <p>Tamaño de muestra: ${dispositivo.sampleSize}</p>
                <p>Canales: ${dispositivo.stereo ? 'Estereo':'Mono'}</p>
                <button type="button" id="play-btn" class="btn btn-primary">Descargar</button>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default close-modal">Cerrar</button>
            </div>
            </div>
        </div>
        `
    }
	
})