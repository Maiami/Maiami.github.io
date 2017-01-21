'use strict';
main()

function main() {
    wanakana.bind(document.querySelector('.result__eeeee'))
    wanakana.bind(document.querySelector('.hiragana__input'))
    wanakana.bind(document.querySelector('.tokensTable__input'))
    wanakana.bind(document.querySelector('.translator__input'))

    $('.helptext').toggleClass('helptext__show')
    $('.help').on('click', function(e) {
        $('.helptext').toggleClass('helptext__show')
        e.preventDefault()
    })

    function routeByHash() {
        let urlHash = parseURL().hash
        if (urlHash === '#tokens') {
            activeModeTokens()
        }
        else if (urlHash === '#trans') {
            activeModeTrans()
        }
        else if (urlHash === '#kana') {
            activeModeHiragana()
        }
        else if (urlHash.match(/#\w+?-\w+?-\w+?-\w+?/)) {
            let showCurrent = urlHash.match(/#\w+?-\w+?-\w+?-\w+/)[0]
            activeModeTrans(showCurrent)
        }
        else {
            activeModeOcr()
        }
    }
    routeByHash()

    $(window).on('hashchange', function () {
        routeByHash()
    })

    $('.options-links__modeOcr').on('click', (e) => {
        e.preventDefault()
        window.location.hash = '#ocr'
        activeModeOcr()
    })
    $('.options-links__modeTokens').on('click', (e) => {
        e.preventDefault()
        window.location.hash = '#tokens'
        activeModeTokens()
    })
    $('.options-links__modeTrans').on('click', (e) => {
        e.preventDefault()
        window.location.hash = '#trans'
        activeModeTrans()
    })
    $('.options-links__modeHiragana').on('click', (e) => {
        e.preventDefault()
        window.location.hash = '#kana'
        activeModeHiragana()
    })

    $('.submenu__modeClean').on('click', function (e) {
        e.preventDefault()

        cropper && cropper.destroy()
        $('.dropzone__img')[0].src = ''
        $('.dropzone__info').show()
        $('.previewOcr').html('')
    })

    $('.dropzone').dropzone('dropzone_hover', e => {
        let dataTransfer = e.originalEvent ? e.originalEvent.dataTransfer : e.dataTransfer

        for (var i = 0; i < dataTransfer.files.length; i++) {
            if (dataTransfer.files[i].type.indexOf('image') === -1) {
                break
            }

            $('.dropzone__img')[0].src = ''
            $('.dropzone__info').hide()

            let imgFile = dataTransfer.files[i]
            let fileReader = new FileReader()
            fileReader.readAsDataURL(imgFile)
            fileReader.onloadend = function () {
                $('.dropzone__img')[0].src = this.result

                miniCrop('.dropzone__img', {
                    onChange: updatePreview,
                    onSelect: finalPreview,
                    onRelease: updatePreview,
                }, function (e) {
                    cropper = this
                })
            }
        }
    })

    setUserParams()

    $('.ocr-params__inputlabel').on('click', function (e) {
        setTimeout(_ => {
            let prevLang = params.lang
            let prevInvert = params.invert
            getUserParams()
            if (prevLang !== params.lang && (params.lang === 'eng' || params.lang === 'kor')) {
                params.psm = 6
            }
            else if (prevLang !== params.lang && (params.lang === 'jpn' || params.lang === 'chi')) {
                params.psm = 5
            }

            if (prevInvert !== params.invert && params.invert === 0) {
                params.brightness = 0
            }
            else if (prevInvert !== params.invert && params.invert === 1) {
                params.brightness = 30
            }
            setUserParams()
            finalPreview()
        }, 50)
    })

    $('.result__label_result-orig').on('input', updateTextarea)
    $('.tokensTable__input').on('input', updateAnalyzeTextarea)

    $('.result__go').on('click', function (e) {
        e.preventDefault()

        activeModeOcr()

        let canvas = generateFinalCanvas()
        if (params.preview === 1) {
            $('.previewOcr').html('').append(canvas)
        }
        if (canvas) {
            Tesseract.recognize(canvas, { lang: params.lang, psm: params.psm }, status => {
                $('.load-progress_wrap').show()
                $('.load-progress_wrap').html(status.msg + ': ' + status.text)
            })
                .then(result => {
                    $('.load-progress_wrap').hide()
                    $('.result__label_result-orig').val(result.text)
                    // let text = result.text.trim()
                    // let gLink = `https://translate.google.ru/?hl=ru#ja/en/${text}`
                    // let mLink = `https://www.bing.com/translator?to=eng&text=${text}`
                    // text = text.slice(0, 8) + '...' 
                    // $('.googleLink').html(`Google Translator <a href='${gLink}' target='_blank'>${text}</a>`)
                    // $('.microsoftLink').html(`Microsoft Translator <a href='${mLink}' target='_blank'>${text}</a>`)
                    updateTextarea()
                })
                .catch(error => {
                    $('.result__label_result-orig').val('error')
                    console.log(error)
                })
        }
    })

    $('.result__analyze').on('click', (e) => {
        e.preventDefault()

        activeModeTokens()
        let textareaValue = $('.result__label_result-orig').val()
        if (!textareaValue) {
            $('.tokensTable__input').val('俺には小学校からの幼馴染がいる')
        }
        else {
            $('.tokensTable__input').val(textareaValue)
        }
        convertInputToTokens()
        updateAnalyzeTextarea()
    })
}