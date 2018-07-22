$(document).ready(function () {
    $.material.init()

    const socket = io()

    function onError(error) {
        alert('Error: ' + error.getResponseHeader('Error-Message'))
    }

    function isModalOpenFor(MAC) {
        return $('body').hasClass('modal-open') && $('#modal .modal-dialog').attr('data-mac') == MAC
    }

    $.ajax('/dispositivos?all=true').done(addAll).fail(onError)

    socket.on('nuevo', function (dispositivo) {
        addAll([dispositivo])
    })
    socket.on('refresh', function (dispositivo) {
        if (isModalOpenFor(dispositivo.mac)) {
            $('.format-info').html(getFormatInfoHtml(dispositivo))
            if (dispositivo.files && dispositivo.files.length) {
                let el = $(getWavHtml(dispositivo.files[0]))
                el.click(onWavFileClick)
                $('.audio-container').append(el)
            }
        }
    })
    socket.on('file', function (file) {
        if (isModalOpenFor(file.mac)) {
            let el = $(getWavHtml(file))
            el.click(onWavFileClick)
            $('.audio-container').append(el)
        }
    })

    function addAll(dispositivo) {
        const container = $('#list-container')
        dispositivo.forEach((dispositivo) => {
            const el = $(getTpl(dispositivo))
            el.click(() => {
                $.ajax('/dispositivos/' + dispositivo.mac)
                    .done(openModal)
                    .fail(onError)
            })
            container.append(el)
        })
    }

    function onWavFileClick(){
        const audioElem = document.getElementById('player')
        const sourceElem = document.getElementById('player-source')
        sourceElem.src = $(this).attr('data-path')
        audioElem.load()
        audioElem.play()
    }

    function openModal(dispositivo) {
        $('body').addClass('modal-open')
        const el = $('#modal')
        el.html(getModalInfo(dispositivo))
        const audioElem = document.getElementById('player')
        const sourceElem = document.getElementById('player-source')
        if (dispositivo.files && dispositivo.files.length) {
            sourceElem.src = dispositivo.files[0].path
            audioElem.load()
        }
        el.find('.close-modal').click(() => {
            $('#fondo').hide()
            $('body').removeClass('modal-open')
            el.hide(300)
            audioElem.pause()
        })
        el.find('.btn-wav').click(onWavFileClick)
        $('#fondo').show()
        el.show(300)
    }

    function getTpl(dispositivo) {
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

    function getFormatInfoHtml(dispositivo) {
        return `
        <li class="list-group-item">
            <span style="font-size:18px;">Frecuencia de muestreo</span>
            <span class="badge badge-pill" style="background-color:#009688;margin-top:4px;">${dispositivo.sampleRate}</span>
        </li>
        <li class="list-group-item" style="margin-top:10px;">
            <span style="font-size:18px;">Tamaño de muestra</span>
            <span class="badge badge-pill" style="background-color:#009688;margin-top:4px;">${dispositivo.sampleSize}</span>
        </li>
        <li class="list-group-item" style="margin-top:10px;">
            <span style="font-size:18px;">Canales</span>
            <span class="badge badge-pill" style="background-color:#009688;margin-top:4px;">${dispositivo.stereo ? 'Estereo' : 'Mono'}</span>
        </li>
        `
    }

    function getModalInfo(dispositivo) {
        return `
                <div class="modal-dialog" data-mac="${dispositivo.mac}">
                    <div class="modal-content">
                        <div class="modal-header">
                        <button type="button" class="close close-modal" aria-hidden="true">×</button>
                        <h3 class="modal-title">
                            <i class="material-icons" style="vertical-align:middle;margin-top:-7px">mic_none</i>
                            ${dispositivo.nombre} - ${dispositivo.mac}
                        </h3>
                        </div>
                        <div class="modal-body">
                        <ul class="list-group format-info" style="width:50%;">
                        ${getFormatInfoHtml(dispositivo)}
                        </ul>
                        <h3 class="modal-title"><i class="material-icons" style="vertical-align:middle;margin-top:-7px">graphic_eq</i> Audios</h3>
                        <div class="audio-container">
                            ${dispositivo.files.map(file => getWavHtml(file)).join('\n')}
                        </div>
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

    }
    function getWavHtml(file) {
        return `<button data-path="${file.path}" type="button" class="btn btn-wav btn-info">
            ${file.name}
            <i class="material-icons">play_circle_outline</i>
        </button>`
    }

})