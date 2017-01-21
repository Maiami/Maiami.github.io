'use strict';

importScripts('tesseract.js-core.js')
importScripts('pako.min.js')

let Module = TesseractCore({
    TOTAL_MEMORY: 180e6,
    TesseractProgress: function (percent) {
        postMessage({ mode: 'progress', msg: 'recognize', text: percent })
    }
})

onmessage = function (e) {
    let json = e.data
    if (json.mode === 'recognize') {
        recognize(json)
    }
}
onerror = function (e) {
    postMessage({ mode: 'error', text: `23 error` })
}

let langFile = {
    'jpn': `tessdata/jpn.traineddata.gz`,
    'eng': `tessdata/eng.traineddata.gz`,
    'kor': `tessdata/kor.traineddata.gz`,
    'chi': `tessdata/chi_tra.traineddata.gz`,
}
let langMas = []

function loadLang(lang, callback) {
    if (!~langMas.indexOf(lang)) {
        let xhr = new XMLHttpRequest()
        xhr.open('GET', langFile[lang], true)
        xhr.responseType = 'arraybuffer'
        xhr.onerror = function () {
            postMessage({ mode: 'error', text: `21 can't load lang file ${lang}` })
        }
        xhr.onprogress = function (e) {
            let percent = Math.round(e.loaded / e.total * 100)
            postMessage({ mode: 'progress', msg: `load lang ${lang}`, text: percent })
        }
        xhr.onload = function () {
            if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
                var response = new Uint8Array(xhr.response)
                while (response[0] == 0x1f && response[1] == 0x8b) {
                    response = pako.ungzip(response)
                }
                Module.FS_createPath("/", "tessdata", true, true)
                Module.FS_createDataFile('tessdata', lang + ".traineddata", response, true, false);

                langMas.push(lang)

                callback()
            }
            else {
                postMessage({ mode: 'error', text: `22 can't load lang file ${lang}` })
            }
        }
        xhr.send()
    }
    else {
        callback()
    }
}

function recognize(json) {
    loadLang(json.opts.lang, _ => {
        let ocrResult = runOcr(json.img, json.opts)

        if (json.opts.lang === 'jpn') {
            ocrResult = ocrResult.replace(/</g, 'く')
            ocrResult = ocrResult.replace(/〈/g, 'く')
            ocrResult = ocrResult.replace(/L/g, 'し')
        }

        postMessage({ mode: 'result', text: ocrResult })
    })
}

function runOcr(imgData, opts) {
    let width = opts.width
    let height = opts.height
    let lang = opts.lang || 'jpn'
    let psm = opts.psm || 5

    postMessage({ mode: 'progress', msg: `init module`, text: 0 })

    let pic = new Uint8Array(width * height)
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            let b = 4 * (i * width + j)
            let luma = (imgData[b] + imgData[b + 1] + imgData[b + 2]) / 3
            let alpha = imgData[b + 3] / 255

            pic[i * width + j] = luma * alpha + (1 - alpha) * 128
        }
    }

    let picptr = Module.allocate(pic, 'i8', Module.ALLOC_NORMAL)

    let base = new Module.TessBaseAPI()
    postMessage({ mode: 'progress', msg: `init module`, text: 25 })
    base.Init(null, lang)

    if (lang === 'jpn') {
        //base.SetVariable("chop_enable", "T")
        //base.SetVariable("use_new_state_cost", "F")
        //base.SetVariable("segment_segcost_rating", "F")
        //base.SetVariable("enable_new_segsearch", 0)
        //base.SetVariable("language_model_ngram_on", 0)
        //base.SetVariable("textord_force_make_prop_words", "F")
        //base.SetVariable("edges_max_children_per_outline", 40)
        ////base.SetVariable("tessedit_char_blacklist", "!")
    }

    base.SetImage(Module.wrapPointer(picptr), width, height, 1, width)
    base.SetRectangle(0, 0, width, height)

    base.SetPageSegMode(psm)

    postMessage({ mode: 'progress', msg: `init module`, text: 100 })

    let text = base.GetUTF8Text()

    base.End()
    Module.destroy(base)
    Module._free(picptr)

    return text
}


