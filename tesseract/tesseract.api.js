'use strict';

let TesseractClass = function () {
    this.worker = null
}

function correctResult(str = '') {
    str = str.replace(/</g, 'く')
    str = str.replace(/〈/g, 'く')
    str = str.replace(/L/g, 'し')
    str = str.replace(/ビキ二/g, 'ビキニ')
    return str
}

TesseractClass.prototype = {
    recognize: function (image, opts, progressCallback) {
        return new Promise(resolve => {
            if (!this.worker) {
                this.worker = new Worker("tesseract/tesseract.api-worker.js")
            }

            this.worker.onmessage = function (e) {
                if (e.data.mode === 'result') {
                    if (e.data.text && opts.lang === 'jpn') {
                        e.data.text = correctResult(e.data.text.trim())
                    }
                    resolve(e.data)
                }
                else if (e.data.mode === 'error') {
                    resolve(Promise.reject(e.data))
                }
                else {
                    if (progressCallback) {
                        progressCallback(e.data)
                    }
                }
            }

            let readyFn = () => {
                let imgData = convertToImageData(image)
                this.worker.postMessage({
                    mode: 'recognize',
                    img: imgData.data,
                    opts: { lang: opts.lang, psm: opts.psm, width: imgData.width, height: imgData.height }
                }, [imgData.data.buffer])
            }

            if (image && image.complete && image.tagName === "IMG") {
                readyFn()
            }
            else if (image.tagName === "IMG") {
                image.addEventListener('load', readyFn)
            }
            else {
                readyFn()
            }
        })
    },
}

var Tesseract = new TesseractClass()

function convertToImageData(image) {
    if (image.getContext) {
        image = image.getContext('2d')
    }
    else if (image.tagName === "IMG") {
        let canvas = document.createElement('canvas')
        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight
        let context = canvas.getContext('2d')
        context.drawImage(image, 0, 0)
        image = context
    }

    if (image.getImageData) {
        image = image.getImageData(0, 0, image.canvas.width, image.canvas.height)
    }

    return image
}