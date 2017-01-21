'use strict';

let cropper = null
let tokenizer = null
let isTokenizerLoad = false
let isWarodaiLoad = false

let params = {
    lang: 'jpn',
    psm: 5,
    invert: 1,
    brightness: 30,
    contrast: 60,
    zoom: 2,
    mode: 2,
    preview: 0,
    filt: ['sharpen', 'blur', 'sharpen'],
}

function setUserParams() {
    $('#lang' + params.lang).prop('checked', true)
    $('#psm' + params.psm).prop('checked', true)
    $('#invert' + params.invert).prop('checked', true)
    $('#contrast' + params.contrast).prop('checked', true)
    $('#brightness' + params.brightness).prop('checked', true)
    $('#zoom' + params.zoom).prop('checked', true)
    $('#mode' + params.mode).prop('checked', true)
    $('#preview' + params.preview).prop('checked', true)
    $('#filt').val(params.filt)

    if (params.mode === 10) {
        $('.advancedOptions').show()
        $('#preview' + 1).prop('checked', true)
    }
    else {
        $('.advancedOptions').hide()
        $('#preview' + 0).prop('checked', true)
        $('.previewOcr').html('')
    }
}

function getUserParams() {
    params.lang = $('.ocr-params__input[name="lang"]:checked').val() || 'jpn'
    params.psm = $('.ocr-params__input[name="psm"]:checked').val() | 0 || 5
    params.invert = $('.ocr-params__input[name="invert"]:checked').val() | 0
    params.brightness = $('.ocr-params__input[name="brightness"]:checked').val() | 0
    params.contrast = $('.ocr-params__input[name="contrast"]:checked').val() | 0
    params.zoom = $('.ocr-params__input[name="zoom"]:checked').val() | 0
    params.mode = $('.ocr-params__input[name="mode"]:checked').val() | 0
    params.preview = $('.ocr-params__input[name="preview"]:checked').val() | 0
    params.filt = $('#filt').val().split(',')
}

function toggleTransClass(el, transClassDiv, transClass) {
    if ($(transClass).css("display") === "none") {
        $(transClass).show()
        let find = el.dataset.fortrans
        if (find) {
            let transHtml = []
            let result = Warodai.translate([find])
            if (result[find]) {
                for (let i = 0; i < result[find].length; i++) {
                    transHtml.push(transJsonToHtml(result[find][i]))
                }
                transHtml = transHtml.join('<br>')
            }
            else {
                transHtml = 'Нет результатов'
            }
            $(transClassDiv).html(transHtml)
        }
    }
    else {
        $(transClass).hide()
    }
}

function tokensBodyFn(tokens) {
    let html = '<tbody class="tokensBody">'
    let i = 0
    for (let token of tokens) {
        let transClass = 'transClass' + '_' + i
        let transClassDiv = 'transClass' + '_' + i + 'div'
        i += 1

        if (token.trans) {
            token.forTrans = ''
        }

        let goTrans = 'Нажми ≡'
        html += `
        <tr class="tokensBody__tr">
            <td class="tokensBody__td">${token.surface_form}</td>
            <td class="tokensBody__td">${token.basic_form}</td>
            <td class="tokensBody__td">${token.pos}</td>
            <td class="tokensBody__td">${token.conjugated_type}</td>
            <td class="tokensBody__td">${token.conjugated_form}</td>
            <td class="tokensBody__td" data-fortrans='${token.forTrans}' style='cursor: pointer;' onclick='toggleTransClass(this, ".${transClassDiv}", ".${transClass}");return false;'>${goTrans}</td>
        </tr>`

        let transHtml = []
        if (token.trans) {
            transHtml = token.trans.split('\n').map(itm => (itm.trim()) ? `<div>${itm}</div>` : `<br>`).join('')
        }
        else {
            // let find = token.forTrans
            // let result = Warodai.translate([find])
            // if (result[find]) {
            //     for (let i = 0; i < result[find].length; i++) {
            //         transHtml.push(transJsonToHtml(result[find][i]))
            //     }
            //     transHtml = transHtml.join('<br>')
            // }
            // else {
            //     transHtml = 'Нет результатов'
            // }
        }

        html += `
        <tr class="tokensBody__tr ${transClass}" style='display: none;'>
            <td colspan='6' class="tokensBody__td">
                <div style='padding-left: 10px;line-height: 1.4;' class='${transClassDiv} transInfo'>
                    ${transHtml}
                </div>
            </td>
        </tr>`
    }
    html += '</tbody>'

    return html
}

// function drawPreview() {
//     let canvas = cropper.getCropCanvas()
//     let result = $(canvas).resizeImage(250)
//     $('.result__preview').html('').append(result)
//     return canvas
// }

function parseURL(url) {
    url = url || document.URL
    let parser = document.createElement('a')
    let searchObject = {}
    parser.href = url
    let queries = parser.search.replace(/^\?/, '').split('&')
    for (let i = 0; i < queries.length; i++) {
        let split = queries[i].split('=')
        searchObject[split[0]] = split[1]
    }
    return {
        protocol: parser.protocol,
        host: parser.host,
        hostname: parser.hostname,
        port: parser.port,
        pathname: parser.pathname,
        search: parser.search,
        searchObject: searchObject,
        hash: parser.hash,
    }
}

function addKana(kana) {
    $('.hiragana__input').val($('.hiragana__input').val() + kana)
}

function generateKanaHtml(type) {
    let kana = {
        hiragana: [
            'a', ' ', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', ' ', 'ra', 'wa', 'ga', 'za', 'da', 'ba', 'pa',
            'あ', 'ぁ', 'か', 'さ', 'た', 'な', 'は', 'ま', 'や', 'ゃ', 'ら', 'わ', 'が', 'ざ', 'だ', 'ば', 'ぱ',
            'i', ' ', 'ki', 'shi', 'chi', 'ni', 'hi', 'mi', ' ', ' ', 'ri', 'wi', 'gi', 'ji', 'di', 'bi', 'pi',
            'い', 'ぃ', 'き', 'し', 'ち', 'に', 'ひ', 'み', ' ', ' ', 'り', 'ゐ', 'ぎ', 'じ', 'ぢ', 'び', 'ぴ',
            'u', ' ', 'ku', 'su', 'tsu', 'nu', 'fu', 'mu', 'yu', ' ', 'ru', ' ', 'gu', 'zu', 'du', 'bu', 'pu',
            'う', 'ぅ', 'く', 'す', 'つ', 'ぬ', 'ふ', 'む', 'ゆ', 'ゅ', 'る', ' ', 'ぐ', 'ず', 'づ', 'ぶ', 'ぷ',
            'e', ' ', 'ke', 'se', 'te', 'ne', 'he', 'me', ' ', ' ', 're', 'we', 'ge', 'ze', 'de', 'be', 'pe',
            'え', 'ぇ', 'け', 'せ', 'て', 'ね', 'へ', 'め', ' ', ' ', 'れ', 'ゑ', 'げ', 'ぜ', 'で', 'べ', 'ぺ',
            'o', ' ', 'ko', 'so', 'to', 'no', 'ho', 'mo', 'yo', ' ', 'ro', 'wo', 'go', 'zo', 'do', 'bo', 'po',
            'お', 'ぉ', 'こ', 'そ', 'と', 'の', 'ほ', 'も', 'よ', 'ょ', 'ろ', 'を', 'ご', 'ぞ', 'ど', 'ぼ', 'ぽ',
            ' ', 'v', ' ', ' ', ' ', 'n', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
            ' ', 'ゔ', ' ', ' ', 'っ', 'ん', '？', 'ー', '・', '「', '」', '『', '』', 'ゝ', 'ゞ', '、', '。'],
        katakana: [
            'a', ' ', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', ' ', 'ra', 'wa', 'ga', 'za', 'da', 'ba', 'pa',
            'ア', 'ァ', 'カ', 'サ', 'タ', 'ナ', 'ハ', 'マ', 'ヤ', 'ャ', 'ラ', 'ワ', 'ガ', 'ザ', 'ダ', 'バ', 'パ',
            'i', ' ', 'ki', 'shi', 'chi', 'ni', 'hi', 'mi', ' ', ' ', 'ri', 'wi', 'gi', 'ji', 'di', 'bi', 'pi',
            'イ', 'ィ', 'キ', 'シ', 'チ', 'ニ', 'ヒ', 'ミ', ' ', ' ', 'リ', 'ヰ', 'ギ', 'ジ', 'ヂ', 'ビ', 'ピ',
            'u', ' ', 'ku', 'su', 'tsu', 'nu', 'fu', 'mu', 'yu', ' ', 'ru', ' ', 'gu', 'zu', 'du', 'bu', 'pu',
            'ウ', 'ゥ', 'ク', 'ス', 'ツ', 'ヌ', 'フ', 'ム', 'ユ', 'ュ', 'ル', ' ', 'グ', 'ズ', 'ヅ', 'ブ', 'プ',
            'e', ' ', 'ke', 'se', 'te', 'ne', 'he', 'me', ' ', ' ', 're', 'we', 'ge', 'ze', 'de', 'be', 'pe',
            'エ', 'ェ', 'ケ', 'セ', 'テ', 'ネ', 'ヘ', 'メ', ' ', ' ', 'レ', 'ヱ', 'ゲ', 'ゼ', 'デ', 'ベ', 'ペ',
            'o', ' ', 'ko', 'so', 'to', 'no', 'ho', 'mo', 'yo', ' ', 'ro', 'wo', 'go', 'zo', 'do', 'bo', 'po',
            'オ', 'ォ', 'コ', 'ソ', 'ト', 'ノ', 'ホ', 'モ', 'ヨ', 'ョ', 'ロ', 'ヲ', 'ゴ', 'ゾ', 'ド', 'ボ', 'ポ',
            ' ', 'v', ' ', ' ', ' ', 'n', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
            ' ', 'ヴ', ' ', ' ', 'ッ', 'ン', '？', 'ー', '・', '「', '」', '『', '』', 'ゝ', 'ゞ', '、', '。']
    }

    let html = `<table align='center'><tbody>`
    for (let r = 0; r < 12; r++) {
        html += '<tr align="center">\n'
        for (let i = 0; i < 17; i++) {
            let ch = kana[type][r * 17 + i]
            if (r % 2 === 0) {
                if (ch === 'wi' || ch === 'we') {
                    html += `<td><font color='#999999'>${ch}</kana></td>\n`
                }
                else {
                    html += `<td>${ch}</td>\n`
                }

            }
            else {
                if (ch.trim()) {
                    html += `<td><div class="hiragana__kana" onclick="addKana('${ch}')">${ch}</div></td>\n`
                }
                else {
                    html += `<td></td>\n`
                }
            }
        }
        html += '</tr>\n'
    }
    html += `</tbody></table>`
    $('.hiragana__table').html(html)
}

function generateFinalCanvas() {
    let cropCanvas = cropper.getCropCanvas()
    let canvas = null
    if (cropCanvas) {
        getUserParams()
        canvas = document.createElement('canvas')
        let filt = params.filt

        if (params.mode === 1) {
            params.brightness = 30
            params.contrast = 60
            filt = ['sharpen', 'blur', 'sharpen']
        }
        else if (params.mode === 2) {
            params.brightness = 30
            params.contrast = 30
            filt = ['sharpenExtra']
        }

        if (params.invert === 0) {
            if (params.lang === 'jpn') {
                params.brightness = 0
                params.contrast = 60
            }
            else if (params.lang === 'eng') {
                params.brightness = 0
                params.contrast = 105
                params.zoom = 4
            }
        }

        if (params.zoom === 1) {
            filt = ['sharpen']
        }

        canvas.width = cropCanvas.width * params.zoom
        canvas.height = cropCanvas.height * params.zoom
        canvas.getContext('2d').drawImage(cropCanvas, 0, 0, canvas.width, canvas.height)

        let ctx = canvas.getContext('2d')

        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        imgData = Filters.grayscale(imgData)
        imgData = Filters.brightness(imgData, params.brightness)

        filt.forEach(fnName => imgData = Filters[fnName.trim()](imgData))

        if (params.invert === 0) {
            imgData = Filters.invert(imgData)
        }

        imgData = Filters.contrast(imgData, params.contrast)

        imgData = Filters.autolvl(imgData)

        // imgData = Filters.autolvlGrayInvert(imgData)
        // imgData = Filters.autolvl(imgData)

        ctx.putImageData(imgData, 0, 0)
    }
    return canvas
}

function redrawCanvas(canvas) {
    if (canvas.width > 0 && canvas.height > 0) {
        getUserParams()
        let ctx = canvas.getContext('2d')

        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        imgData = Filters.grayscale(imgData)
        // imgData = Filters.brightness(imgData, 30)
        imgData = Filters.brightness(imgData, params.brightness)

        // imgData = Filters.sharpenExtra(imgData)
        imgData = Filters.sharpen(imgData)
        imgData = Filters.blur(imgData)
        imgData = Filters.sharpen(imgData)

        if (params.invert === 0) {
            imgData = Filters.invert(imgData)
        }

        // imgData = Filters.contrast(imgData, 45)
        imgData = Filters.contrast(imgData, params.contrast)
        imgData = Filters.autolvl(imgData)

        // imgData = Filters.autolvlGrayInvert(imgData)
        // imgData = Filters.autolvl(imgData)

        ctx.putImageData(imgData, 0, 0)
    }
}

function changeCanvas(c, crop) {
    let canvas = drawPreview()
    redrawCanvas(canvas)
    $(crop.canvasClass).append(canvas)
}

function updatePreview(c, crop) {
    let canvas = crop.getPreviewCanvas(250, 250)
    $('.result__preview').html('').append(canvas)
}

function finalPreview(c, crop) {
    let canvas = cropper.getCropCanvas(250, 250)
    if (canvas) {
        let result = $(canvas).resizeImage(250)
        // redrawPreviewCanvas(result)
        redrawCanvas(result)
        $('.result__preview').html('').append(result)
    }
}

function loadDemo(imgLink) {
    activeModeOcr()

    $('.dropzone__img')[0].src = ''
    $('.dropzone__info').hide()

    $('.dropzone__img')[0].src = imgLink

    $('.dropzone__img').on('load', e => {
        miniCrop('.dropzone__img', {
            onChange: updatePreview,
            onSelect: finalPreview,
            onRelease: updatePreview,
        }, function (e) {
            cropper = this
            cropper.previewBox = [500, 500]
        })
    })
}

function hideAllMode() {
    $('.dropzone').hide()
    $('.tokensTable').hide()
    $('.translator').hide()
    $('.hiragana').hide()
    $('.options-links__modeOcr > .button').removeClass('button_hover')
    $('.options-links__modeTokens > .button').removeClass('button_hover')
    $('.options-links__modeTrans > .button').removeClass('button_hover')
    $('.options-links__modeHiragana > .button').removeClass('button_hover')
}

function activeModeOcr() {
    hideAllMode()
    $('.dropzone').show()
    $('.options-links__modeOcr > .button').addClass('button_hover')

    let helpText = `
        На каждой странице своя подсказка!

        Если не получается распознать, то попробуйте такие варианты:

        1. Выбрать mode1
        2. Инвентировать цвета
        3. Сделать более точный захват текста
        4. Сделать более обширный захват текста

        5. При выборе текста для распознания старайтесь не захватывать знаки пунктуации, такие как ! или ?

        После распознания вы можете в маленьком поле ввода дописать или исправить нужные символы
        Чтобы получились маленькие японские буквы пишите перед буквой l (little)
        a - あ
        la - ぁ

        tsu - つ
        ltsu - っ 

        Чтобы писать на катакане, пишите с нажатым shift
    `
    $('.helptext__text').html(helpText.replace(/\n/g, '<br>'))
}

function findTrans(showCurrent) {
    let value = [$('.translator__input').val().trim()]
    let find = showCurrent ? showCurrent.slice(1) : value
    let result = Warodai.translate(find)
    if (result[find]) {
        let html = []
        for (let i = 0; i < result[find].length; i++) {
            html.push(transJsonToHtml(result[find][i]))
        }
        html = html.join('<br>')
        $('.translator__result').html(html)
    }
    else {
        $('.translator__result').html('Нет результатов')
    }
}

function transJsonToHtml(t) {
    let hiragana = t.hiragana.join(', ')
    let kanji = ''
    if (t.kanji) {
        kanji = t.kanji.map(itm => itm.join('･')).join(', ')
    }

    let html = `<div>${hiragana} 【${kanji || ''}】 (${wanakana.toRomaji(hiragana)})</div>`
    if (t.defs && t.defs.length > 0) {
        let defsHtml = t.defs.map(itm => `<div>${itm}</div>`).join('')
        html += defsHtml
    }

    return html
}

function activeModeTrans(showCurrent) {
    if (!isWarodaiLoad) {
        $('.translator__loading').show()
        $('.translator__working').hide()

        Warodai.init()
            .then(result => {
                isWarodaiLoad = true
                $('.translator__loading').hide()
                $('.translator__working').show()
                if (showCurrent) {
                    findTrans(showCurrent)
                }
            })
            .catch(err => console.log(err))
    }
    if (isWarodaiLoad) {
        $('.translator__loading').hide()
        $('.translator__working').show()
        if (showCurrent) {
            findTrans(showCurrent)
        }
    }
    hideAllMode()
    $('.translator').show()
    $('.options-links__modeTrans > .button').addClass('button_hover')

    let helpText = `
        На каждой странице своя подсказка!

        Если что-то не нашлось тут, то проверяйте перевод на сайтах:

        <a href='http://www.yarxi.ru/' target='_blank'>http://www.yarxi.ru/</a>
        <a href='http://slovar.woxikon.ru/ru-ja/' target='_blank'>http://slovar.woxikon.ru/ru-ja/</a>
    `
    $('.helptext__text').html(helpText.replace(/\n/g, '<br>'))
}

function activeModeTokens() {
    if (!isTokenizerLoad) {
        $('.tokensTable__loading').show()
        $('.tokensTable__working').hide()
        kuromoji.builder({ dicPath: 'kuromoji/dict/' }).build(function (error, _tokenizer) {
            if (error) {
                console.log(error)
            }
            else {
                Warodai.init()
                    .then(result => {
                        tokenizer = _tokenizer
                        isTokenizerLoad = true
                        isWarodaiLoad = true

                        $('.tokensTable__input').on('input', function (e) {
                            convertInputToTokens()
                        })
                        $('.tokensTable__loading').hide()
                        $('.tokensTable__working').show()
                        updateAnalyzeTextarea()
                    })
                    .catch(err => console.log(err))
            }
        })
    }
    hideAllMode()
    $('.tokensTable').show()
    $('.options-links__modeTokens > .button').addClass('button_hover')

    let helpText = `
        На каждой странице своя подсказка!

        Общая структура японского языка

        Слова в японском языке следуют в следующем порядке: субъект действия - объект действия - глагол действия. 
        Характерная структура предложения:

        <span class='helptext__block'>тема предложения</span> <span class='helptext__block'>время</span> <span class='helptext__block'>место</span> <span class='helptext__block'>субъект</span> <span class='helptext__block'>косвенный объект</span> <span class='helptext__block'>прямой объект</span> <span class='helptext__block'>глагол</span>

        Глагол практически всегда располагается в конце предложений.
        
        После глагола могут добавляться частицы или вспомогательные глаголы определяющие эмоциональность, тон предложения и падеж глагола.
        
        
        Уроки японского (есть описания частиц, окончаний глаголов и т.д.):
        <a href='http://nippon.temerov.org/gramat.php?pad=commonhar' target='_blank'>http://nippon.temerov.org/</a>
        
        Очень простые уроки японского шаг за шагом:
        <a href='https://www.nhk.or.jp/lesson/russian/learn/list/1.html' target='_blank'>https://www.nhk.or.jp/lesson/russian/learn/list/1.html</a>
    `
    $('.helptext__text').html(helpText.replace(/\n/g, '<br>'))
}

function updateTextarea(e) {
    $('.result__label_result-orig')[0].style.height = "5px";
    $('.result__label_result-orig')[0].style.height = ($('.result__label_result-orig')[0].scrollHeight) + "px";

    let text = $('.result__label_result-orig').val()

    let wana = wanakana.toRomaji(text)
    $('.result__label_result-wana').html('<pre>' + wana + '</pre>')
}

function updateAnalyzeTextarea(e) {
    $('.tokensTable__input')[0].style.height = "34px";
    $('.tokensTable__input')[0].style.height = ($('.tokensTable__input')[0].scrollHeight + 4) + "px";
}

function activeModeHiragana() {
    hideAllMode()
    generateKanaHtml('hiragana')
    $('.hiragana').show()
    $('.options-links__modeHiragana > .button').addClass('button_hover')

    let helpText = `
        На каждой странице своя подсказка!

        Чтобы получились маленькие японские буквы пишите перед буквой l (little)
        a - あ
        la - ぁ

        tsu - つ
        ltsu - っ 

        Чтобы писать на катакане, пишите с нажатым shift
    `
    $('.helptext__text').html(helpText.replace(/\n/g, '<br>'))
}

function convertInputToTokens() {
    if (!isTokenizerLoad) {
        $('.tokensTable__loading').show()
        $('.tokensTable__working').hide()
        kuromoji.builder({ dicPath: 'kuromoji/dict/' }).build(function (error, _tokenizer) {
            if (error) {
                console.log(error)
            }
            tokenizer = _tokenizer
            isTokenizerLoad = true

            $('.tokensTable__input').on('input', function (e) {
                convertInputToTokens()
            })
            $('.tokensTable__loading').hide()
            $('.tokensTable__working').show()
            updateAnalyzeTextarea()
            convertInputToTokens()
        })
    }
    else {
        let str = normalizeStrForAnalize($('.tokensTable__input').val())
        let tokens = tokenizer.tokenize(str)
        tokens = normalizeTokens(tokens)
        let html = tokensBodyFn(tokens)
        $('.tokensTable__tbody').html(html)

        let resultPreview = []
        tokens.forEach(token => {
            if (token.surface_form[0] === '\n' && token.word_type === 'UNKNOWN') {
                resultPreview.push('\n')
            }
            else {
                resultPreview.push(token.reading)
            }
        })
        resultPreview = wanakana.toRomaji(resultPreview.join(' '))
        resultPreview = resultPreview.replace(/^\s+?/gm, '')
        $('.tokensTable__preview').html(resultPreview)
    }
}
