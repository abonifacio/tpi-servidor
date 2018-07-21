$(document).ready(function() { 
    $.material.init()
    
    const socket = io()

    function onError(error){
        alert('Error: '+error.getResponseHeader('Error-Message'))
    }
    
    $.ajax('/dispositivos?all=true').done(addAll).fail(onError)
    
    socket.on('nuevo',function(dispositivo){
        addAll([dispositivo])
    })
    
    function addAll(dispositivo){
        const container =  $('#list-container')
        dispositivo.forEach((dispositivo)=>{
            const el = $(getTpl(dispositivo))
            el.click(()=>{
                $.ajax('/dispositivos/'+dispositivo.mac)
                .done(openModal)
                .fail(onError)
            })
            container.append(el)
        })    
    }
    
    function openModal(dispositivo){
        $('body').addClass('modal-open')
        const el = $('#modal')
        el.html(getModalInfo(dispositivo))
        const audioElem = document.getElementById('player')
        const sourceElem = document.getElementById('player-source')
        if(dispositivo.files && dispositivo.files.length){
            sourceElem.src = dispositivo.files[0].path
            audioElem.load()
        }
        el.find('.refresh-button').click(()=>{
            $.ajax('/dispositivos/'+dispositivo.mac)
            .done(openModal)
            .fail(onError)
        })
        el.find('.close-modal').click(()=>{
            $('#fondo').hide()
            $('body').removeClass('modal-open')
            el.hide(300)
            audioElem.pause()
        })
        el.find('.btn-wav').click(function(){
            sourceElem.src = $(this).attr('data-path')
            audioElem.load()
            audioElem.play()
        })
        $('#fondo').show()
        el.show(300)
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
                        <h3 class="modal-title">
                            ${dispositivo.nombre} - ${dispositivo.mac}
                            <button type="button" class="btn btn-info refresh-button"><i class="material-icons">refresh</i></button>
                        </h3>
                        </div>
                        <div class="modal-body">
                        <p>Frecuencia de muestreo: ${dispositivo.sampleRate}</p>
                        <p>Tamaño de muestra: ${dispositivo.sampleSize}</p>
                        <p>Canales: ${dispositivo.stereo ? 'Estereo':'Mono'}</p>
                        <h3 class="modal-title">Audios</h3>
                        ${getWavsHtml(dispositivo.files)}
                        <div>
                            <audio style="width:100%;" id="player" controls>
                                <source id="player-source" type="audio/wav">
                            </audio> 
                        </div>
                        </div>
                        <div class="modal-footer">
                        <button type="button" class="btn btn-default close-modal">Cerrar</button>
                    </div>
                </div>
            </div>`

            function getWavsHtml(files){
                return `<div >
                    ${files.map(file=>`<button data-path="${file.path}" type="button" class="btn btn-wav btn-info">${file.name}</button>`).join('\n')}
                </div>`
            }
        }
	
})