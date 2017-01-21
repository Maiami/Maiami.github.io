'use strict';

var miniCrop = (function () {
    let MiniCrop = function (userClass) {
        this.opts = {}
        this.userClass = userClass
        this.tempPreviewCanvas = document.createElement('canvas')
    }

    let $ = (function () {
        let MicroJquery = function (arr) {
            this.length = arr.length
            for (let i = 0; i < this.length; i++) {
                this[i] = arr[i]
            }
            return this
        }

        MicroJquery.prototype = {
            shhi: function (display) {
                for (let i = 0; i < this.length; i++) {
                    this[i].style.display = display
                }
                return this
            },
            hide: function () {
                return this.shhi('none')
            },
            show: function () {
                return this.shhi('block')
            },
            onoff: function (eventName, eventAction, type) {
                var events = eventName.split(' ')
                for (let i = 0; i < this.length; i++) {
                    for (let j = 0; j < events.length; j++) {
                        this[i][type](events[j], eventAction)
                    }
                }
                return this
            },
            on: function (eventName, eventAction) {
                return this.onoff(eventName, eventAction, 'addEventListener')
            },
            off: function (eventName, eventAction) {
                return this.onoff(eventName, eventAction, 'removeEventListener')
            },
            css: function (props) {
                if (typeof props === 'string') {
                    return window.getComputedStyle(this[0], null).getPropertyValue(props)
                }
                for (let i = 0; i < this.length; i++) {
                    for (let prop in props) {
                        this[i].style[prop] = props[prop]
                    }
                }
                return this
            },
            offset: function () {
                let el = this[0]
                if (el) {
                    let rect = el.getBoundingClientRect()
                    let docElem = el.ownerDocument.documentElement
                    return {
                        top: rect.top + window.pageYOffset - docElem.clientTop,
                        left: rect.left + window.pageXOffset - docElem.clientLeft,
                    }
                }
                return null
            },
        }

        let microJquery = function (selector) {
            if (selector instanceof MicroJquery) {
                return selector
            }

            let arr = []
            if (selector === document) {
                arr.push(selector)
            }
            else {
                arr = document.querySelectorAll(selector)
            }
            return new MicroJquery(arr)
        }

        return microJquery
    })()

    let mouseMoveTouchMove = 'mousemove touchmove'
    let mouserUpTouchEnd = 'mouseup touchend'
    let mouseDownTouchStart = 'mousedown touchstart'

    MiniCrop.prototype = {
        addHtml: function () {
            let cls = this.cropClass.slice(1)
            let clsBox = this.cropBox.slice(1)
            let clsMove = this.cropMove.slice(1)
            let clsSqrt = this.cropSqrts.slice(1)
            let clsDragbar = this.cropDragbars.slice(1)
            let clsEdge = this.cropClass.slice(1) + '__edge'
            let clsGif = clsEdge + '_gif'
            let clsInnerimg = this.cropInnerimg.slice(1)
            let clsOpact = this.cropOpact.slice(1)
            let clsKeys = this.cropKeys.slice(1)

            let top = $(this.userClass).offset().top + 'px'
            let left = $(this.userClass).offset().left + 'px'
            let width = 'width:' + $(this.userClass)[0].offsetWidth + 'px;'
            let height = 'height:' + $(this.userClass)[0].offsetHeight + 'px;'
            let src = $(this.userClass)[0].src

            let top0 = 'top: 0px;'
            let left0 = 'left: 0px;'
            let bottom0 = 'bottom: 0px;'
            let right0 = 'right: 0px;'
            let height7px = 'height: 7px;'
            let width7px = 'width: 7px;'
            let height100p = 'height: 100%;'
            let width100p = 'width: 100%;'
            let margin_left = 'margin-left: -4px;'
            let margin_top = 'margin-top: -4px;'
            let margin_right = 'margin-right: -4px;'
            let margin_bottom = 'margin-bottom: -4px;'
            let border1px = '1px dashed rgba(0, 0, 0, 0.0);'

            let absolute = 'position: absolute;'
            let fullFill = 'top: 0px; left: 0px; height: 100%; width: 100%;'
            let topleft = `top: ${top}; left: ${left};`
            let cursor = 'cursor'
            let resize = 'resize'
            let zindex99 = 'z-index: 99;'
            let zindex100 = 'z-index: 100;'

            let gif = 'image/gif;base64,R0lGODlhCAAIAJEAAKqqqv///wAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCgAAACwAAAAACAAIAAACDZQFCadrzVRMB9FZ5SwAIfkECQoAAAAsAAAAAAgACAAAAg+ELqCYaudeW9ChyOyltQAAIfkECQoAAAAsAAAAAAgACAAAAg8EhGKXm+rQYtC0WGl9oAAAIfkECQoAAAAsAAAAAAgACAAAAg+EhWKQernaYmjCWLF7qAAAIfkECQoAAAAsAAAAAAgACAAAAg2EISmna81UTAfRWeUsACH5BAkKAAAALAAAAAAIAAgAAAIPFA6imGrnXlvQocjspbUAACH5BAkKAAAALAAAAAAIAAgAAAIPlIBgl5vq0GLQtFhpfaIAACH5BAUKAAAALAAAAAAIAAgAAAIPlIFgknq52mJowlixe6gAADs='
            let css = `
				.${clsGif} {background: white; opacity: 0.4; background-image: url(data:${gif});}

				.${clsEdge}_top {border-top: ${border1px} ${absolute} ${top0} ${left0} ${width100p}}
				.${clsEdge}_right {border-right: ${border1px} ${absolute} ${bottom0} ${right0} ${height100p}}
				.${clsEdge}_bottom {border-bottom: ${border1px} ${absolute} ${bottom0} ${right0} ${width100p}}
				.${clsEdge}_left {border-left: ${border1px} ${absolute} ${top0} ${left0} ${height100p}}

				.${clsDragbar} {${absolute}}
				.${clsDragbar}_n {${cursor}: n-${resize}; ${top0} ${margin_top} ${height7px} ${width100p} ${zindex99}}
				.${clsDragbar}_e {${cursor}: e-${resize}; ${right0} ${top0} ${margin_right} ${height100p} ${width7px} ${zindex99}}
				.${clsDragbar}_s {${cursor}: n-${resize}; ${bottom0} ${margin_bottom} ${height7px} ${width100p} ${zindex99}}
				.${clsDragbar}_w {${cursor}: e-${resize}; ${left0} ${top0} ${margin_left} ${height100p} ${width7px} ${zindex99}}

				.${clsSqrt} {${absolute} ${width7px} ${height7px} border: 1px #eee solid; background-color: #333; opacity: 0.5;}
				.${clsSqrt}_n {${cursor}: n-${resize}; ${top0} left: 50%; ${margin_left} ${margin_top}}
				.${clsSqrt}_e {${cursor}: e-${resize}; top: 50%; ${right0} ${margin_right} ${margin_top}}
				.${clsSqrt}_s {${cursor}: s-${resize}; ${bottom0} left: 50%; ${margin_bottom} ${margin_left}}
				.${clsSqrt}_w {${cursor}: w-${resize}; top: 50%; ${left0} ${margin_left} ${margin_top}}
				.${clsSqrt}_ne {${cursor}: ne-${resize}; ${top0} ${right0} ${margin_right} ${margin_top} ${zindex100}}
				.${clsSqrt}_se {${cursor}: se-${resize}; ${bottom0} ${right0} ${margin_bottom} ${margin_right} ${zindex100}}
				.${clsSqrt}_sw {${cursor}: sw-${resize}; ${bottom0} ${left0} ${margin_bottom} ${margin_left} ${zindex100}}
				.${clsSqrt}_nw {${cursor}: nw-${resize}; ${top0} ${left0} ${margin_left} ${margin_top} ${zindex100}}
			`

            let divClass = '<div class'

            let imgClone = $(this.userClass)[0].cloneNode()
            this.userCloneClass = '.' + 'abcdezxcvasfd' + '_userCloneClass_' + (Math.random() * 1000 | 0)
            imgClone.classList.add(this.userCloneClass.slice(1))
            $(this.userClass).hide()

            this.cropClassFull = '.' + 'cropClassFull_' + (Math.random() * 1000 | 0)

            this.markClass = 'minicroppermarkclass_' + this.userClass.replace(/\./g, '_')
            this.markClassCrop = 'minicroppermarkclass_' + this.userClass.replace(/\./g, '_') + '_cropclass'
            $(this.userClass)[0].classList.add(this.markClass)
            $(this.userClass)[0].setAttribute('data-cropattrsW', this.origMaxWidth)
            $(this.userClass)[0].setAttribute('data-cropattrsH', this.origMaxHeight)

            let html = `				
                <div class='${this.cropClassFull.slice(1)} ${this.markClassCrop}' style='position: relative; ${width} ${height}'>
                    <style>${css}</style>
                    ${divClass}='${cls}' style="${absolute} ${width} ${height} top: 0px; left: 0px;">
                        ${divClass}='${clsOpact}' style='${absolute} ${fullFill}'></div>
                        <input type="radio" class="${clsKeys}" style="position: fixed; left: -120px; width: 12px;">

                        ${divClass}='${clsBox}' style='${absolute}'>
                            ${divClass}='${clsMove}' style="${absolute} overflow: hidden; ${fullFill}">
                                <img class='${clsInnerimg}' src="${src}" style='${absolute} ${width} ${height} ${topleft}'>
                            </div>

                            ${divClass}='${clsEdge}_top ${clsGif}'></div>
                            ${divClass}='${clsEdge}_right ${clsGif}'></div>
                            ${divClass}='${clsEdge}_bottom ${clsGif}'></div>
                            ${divClass}='${clsEdge}_left ${clsGif}'></div>

                            ${divClass}='${clsSqrt} ${clsSqrt}_n'></div>
                            ${divClass}='${clsSqrt} ${clsSqrt}_e'></div>
                            ${divClass}='${clsSqrt} ${clsSqrt}_s'></div>
                            ${divClass}='${clsSqrt} ${clsSqrt}_w'></div>

                            ${divClass}='${clsSqrt} ${clsSqrt}_ne'></div>
                            ${divClass}='${clsSqrt} ${clsSqrt}_se'></div>
                            ${divClass}='${clsSqrt} ${clsSqrt}_sw'></div>
                            ${divClass}='${clsSqrt} ${clsSqrt}_nw'></div>

                            ${divClass}='${clsDragbar} ${clsDragbar}_n'></div>
                            ${divClass}='${clsDragbar} ${clsDragbar}_e'></div>
                            ${divClass}='${clsDragbar} ${clsDragbar}_s'></div>
                            ${divClass}='${clsDragbar} ${clsDragbar}_w'></div>
                        </div>
                    </div>
                    ${imgClone.outerHTML}
                </div>
			`
            $(this.userClass)[0].insertAdjacentHTML('afterend', html)
        },
        getPreviewCanvas: function(previewW, previewH) {
            let c = this.tellSelect()
            let canvas = null
            if(c.w && c.h) {
                let origImage = document.querySelector(this.userCloneClass)
                canvas = this.tempPreviewCanvas
                let ctx = canvas.getContext('2d')
                ctx.clearRect(0, 0, canvas.width, canvas.height)

                canvas.imageSmoothingEnabled = false
                canvas.imageSmoothingQuality = 'high'

                let aspectRatio = c.w / c.h
                let width = previewW
                let height = previewH
                canvas.width = width
                canvas.height = height
                if (aspectRatio > 1) {
                    canvas.height = width / aspectRatio
                }
                else {
                    canvas.width = height * aspectRatio
                }
                if (canvas.width >= previewW) {
                    canvas.width = previewW
                    canvas.height = previewW / aspectRatio
                }
                if (canvas.height >= previewH) {
                    canvas.height = previewH
                    canvas.width = previewH * aspectRatio
                }

                ctx.drawImage(origImage, c.x, c.y, c.w, c.h, 0, 0, canvas.width, canvas.height)
            }
            return canvas
        },
        getCropCanvas: function (upscaleW, upscaleH) {
            let c = this.tellSelect()
            let canvas = null
            if (c.w && c.h) {
                if(c.w < upscaleW || c.h < upscaleH) {
                    return this.getPreviewCanvas(upscaleW, upscaleH)
                }
                let origImage = document.querySelector(this.userCloneClass)
                canvas = document.createElement('canvas')
                canvas.width = c.w
                canvas.height = c.h
                canvas.getContext('2d').drawImage(origImage, c.x, c.y, c.w, c.h, 0, 0, canvas.width, canvas.height)
            }
           
            return canvas
        },
        select: function ([left, top, width, height]) {
            let offset = $(this.userCloneClass).offset()
            if (left > offset.left + $(this.userCloneClass)[0].clientWidth) {
                left = 0
                width = 0
            }
            if (top > offset.top + $(this.userCloneClass)[0].clientHeight) {
                top = 0
                height = 0
            }

            let [newWidth, newHeight] = this.detectOver(top, left, width, height)

            $(this.cropBox).show()
            this.drawCropper(top, left, newWidth, newHeight)
            this.endSelect()
        },
        release: function () {
            this.select([0, 0, 0, 0])
        },
        setSelect: function ([x, y, x2, y2]) {
            this.select([x, y, x2 - x, y2 - y])
        },
        animateTo: function ([x, y, x2, y2]) {
            this.setSelect([x, y, x2, y2])
        },
        tellSelect: function () {
            let {x, y, x2, y2, w, h} = this.tellScaled()
            let xscale = this.xscale
            let yscale = this.yscale
            return {
                x: x * xscale, y: y * yscale, x2: x2 * xscale, y2: y2 * yscale, w: w * xscale, h: h * yscale
            }
        },
        tellScaled: function () {
            let cropBox = $(this.cropBox)
            let w = cropBox[0].clientWidth
            let h = cropBox[0].clientHeight
            let x = 0, x2 = 0, y = 0, y2 = 0
            let offsetBox = cropBox.offset()
            let offsetUser = $(this.userCloneClass).offset()
            if (w || h) {
                x = offsetBox.left - offsetUser.left
                y = offsetBox.top - offsetUser.top
                x2 = x + w
                y2 = y + h
            }
            return { x, y, x2, y2, w, h }
        },
        disable: function () {
            $(this.userCloneClass).off(mouseDownTouchStart, this.userMseDown)
            $(this.cropOpact).off(mouseDownTouchStart, this.userMseDown)
            $(this.cropMove).off(mouseDownTouchStart, this.cropMoveMseDown)

            let defaultCursor = { cursor: '' }
            $(this.userCloneClass).css(defaultCursor)
            $(this.cropOpact).css(defaultCursor)
            $(this.cropBox).css(defaultCursor)
            $(this.cropSqrts).hide()

            $(this.cropSqrts).off(mouseDownTouchStart, this.resizeDocMseDown)
            $(this.cropDragbars).off(mouseDownTouchStart, this.resizeDocMseDown)
        },
        preEnable: function () {
            let opts = this.opts

            let userClass = this.userClass
            // let userWidth = $(userClass)[0].naturalWidth
            // let userHeight = $(userClass)[0].naturalHeight 
            let userWidth = $(userClass)[0].clientWidth
            let userHeight = $(userClass)[0].clientHeight
            this.userWidth = userWidth
            this.userHeight = userHeight

            this.origMaxWidth = $(userClass).css('max-width')
            this.origMaxHeight = $(userClass).css('max-height')

            opts.boxWidth = opts.boxWidth || userWidth
            opts.boxHeight = opts.boxHeight || userHeight

            let xscale = opts.boxWidth ? (userWidth / opts.boxWidth) : 1
            let yscale = opts.boxHeight ? (userHeight / opts.boxHeight) : 1

            if (opts.boxWidth > opts.boxHeight) {
                xscale = yscale
            }
            else {
                yscale = xscale
            }

            if (opts.boxWidth) {
                $(userClass)[0].style.maxWidth = opts.boxWidth + 'px'
            }
            if (opts.boxHeight) {
                $(userClass)[0].style.maxHeight = opts.boxHeight + 'px'
            }

            if (opts.trueSize) {
                xscale = opts.trueSize[0] / userWidth
                yscale = opts.trueSize[1] / userHeight
            }
            this.xscale = xscale
            this.yscale = yscale

            let cropClass = '.cropper'
            let cropBox = cropClass + '__box'
            let cropOpact = cropClass + '__opact'
            this.cropClass = cropClass
            this.cropOpact = cropOpact

            this.cropBox = cropClass + '__box'
            this.cropMove = cropClass + '__moveVoid'
            this.cropSqrts = cropClass + '__sqrt'
            this.cropDragbars = cropClass + '__dragbar'
            this.cropKeys = cropClass + '__keys'
            this.cropInnerimg = cropClass + '__innerimg'

            if (!$(cropBox)[0]) {
                this.addHtml()
            }

            this.cropCoord = {}
            this.moveStartX = 0
            this.moveStartY = 0

            this.endSelect()

            $(this.userCloneClass).css({ cursor: 'crosshair' })
            $(cropOpact).css({ cursor: 'crosshair' })
            $(cropBox).css({ cursor: 'move' })

            let bgCss = {}
            opts.bgOpacity = opts.bgOpacity || '0.4'
            bgCss['background'] = opts.bgColor || 'black'
            bgCss['opacity'] = opts.bgOpacity
            $(cropOpact).css(bgCss)

            if (opts.select) {
                this.select(opts.select)
            }
            if (opts.setSelect) {
                this.setSelect(opts.setSelect)
            }

            if (opts.selection) {
                let selection = opts.selection.trim()
                if (~selection.indexOf('%')) {
                    selection = selection.slice(0, -1)
                }
                selection = (selection | 0) / 100
                let selectWidth = userWidth * selection
                let selectHeight = userHeight * selection
                this.select([0, 0, selectWidth, selectHeight])
            }
            this.opts = opts
        },
        enable: function (opts) {
            if (opts) {
                this.opts = opts
            }
            else {
                opts = this.opts
            }

            this.init = true
            this.initQuery = []

            this.preEnable(opts)

            let docMseUp = (e, fnMove, fnUp) => {
                this.endSelect()
                $(document).off(mouseMoveTouchMove, fnMove)
                $(document).off(mouserUpTouchEnd, fnUp)
            }
            let resizeDocMseMove = e => this.handResize(e)
            let resizeDocMseUp = e => {
                docMseUp(e, resizeDocMseMove, resizeDocMseUp)
            }

            let moveDocMseMove = e => {
                e.preventDefault()
                this.moveCropper(e)
            }
            let moveDocMseUp = e => {
                docMseUp(e, moveDocMseMove, moveDocMseUp)
            }

            let userMseDown = e => {
                e.preventDefault()

                this.keyFocus()
                $(this.cropOpact).css({ opacity: this.opts.bgOpacity })

                this.drawCropper(this.getY(e), this.getX(e), 0, 0)
                this.updateStartCoords()

                $(this.cropSqrts).hide()

                $(document).on(mouseMoveTouchMove, resizeDocMseMove)
                $(document).on(mouserUpTouchEnd, resizeDocMseUp)
            }

            let cropMoveMseDown = e => {
                e.preventDefault()

                this.keyFocus()

                this.moveStartX = this.getX(e)
                this.moveStartY = this.getY(e)
                this.updateStartCoords()

                $(this.cropSqrts).hide()

                $(document).on(mouseMoveTouchMove, moveDocMseMove)
                $(document).on(mouserUpTouchEnd, moveDocMseUp)
            }

            let resizeDocMseDown = e => {
                e.preventDefault()

                this.keyFocus()

                let type = e.currentTarget.classList[1].slice(-2)
                this.nesw = type[0] === '_' ? type.slice(1) : e.currentTarget.classList[1].slice(-2)
                this.updateStartCoords()

                $(document).on(mouseMoveTouchMove, resizeDocMseMove)
                $(document).on(mouserUpTouchEnd, resizeDocMseUp)
            }

            this.docMseUp = docMseUp
            this.resizeDocMseMove = resizeDocMseMove
            this.resizeDocMseUp = resizeDocMseUp
            this.moveDocMseMove = moveDocMseMove
            this.moveDocMseUp = moveDocMseUp
            this.userMseDown = userMseDown
            this.cropMoveMseDown = cropMoveMseDown
            this.resizeDocMseDown = resizeDocMseDown

            $(this.cropOpact).on(mouseDownTouchStart, userMseDown)
            $(this.cropMove).on(mouseDownTouchStart, cropMoveMseDown)

            $(this.cropSqrts).on(mouseDownTouchStart, resizeDocMseDown)
            $(this.cropDragbars).on(mouseDownTouchStart, resizeDocMseDown)

            this.addKeyEvent()

            this.endSelect()
            this.init = false
        },
        keyFocus: function () {
            $(this.cropKeys).show()[0].focus()
        },
        addKeyEvent: function () {
            this.keyFocus()

            $(this.cropKeys).on('keyup', e => {
                if (e.keyCode === 27) {
                    this.release()
                }
            })

            $(this.cropKeys).on('keydown', e => {
                let key = e.keyCode
                let offset = e.shiftKey ? 10 : 1

                if (e.ctrlKey || e.metaKey || key === 9) {
                    return true
                }

                if (key === 37 || key === 38 || key === 39 || key === 40) {
                    e.preventDefault()

                    let offsetX = 0
                    let offsetY = 0
                    if (key === 37) {
                        offsetX += offset
                    }
                    else if (key === 38) {
                        offsetY += offset
                    }
                    else if (key === 39) {
                        offsetX -= offset
                    }
                    else if (key === 40) {
                        offsetY -= offset
                    }
                    this.moveCropBox(offsetX, offsetY)
                    this.endSelect()
                }
            })

            $(this.cropKeys).on('blur', e => {
                $(this.cropKeys).hide()
            })
        },
        destroy: function () {
            this.select([0, 0, 0, 0])
            this.disable()
            $(this.cropClassFull)[0].remove()
            // $(this.cropClass)[0].remove()
            // $(this.userClass).css({'max-width': this.origMaxWidth, 'max-height': this.origMaxHeight})
            $(this.userClass).css({ 'max-width': '', 'max-height': '' })
            $(this.userClass).show()
            $(this.userClass)[0].classList.remove(this.markClass)
        },
        getX: function (e) {
            let changeTouchs = e.changedTouches
            let x = e.pageX || (changeTouchs && changeTouchs[0].pageX)
            return x - $(this.userCloneClass).offset().left
        },
        getY: function (e) {
            let changeTouchs = e.changedTouches
            let y = e.pageY || (changeTouchs && changeTouchs[0].pageY)
            return y - $(this.userCloneClass).offset().top
        },
        updateStartCoords: function () {
            $(this.cropBox).show()

            let cropBox = $(this.cropBox)[0]
            let offsetBox = $(this.cropBox).offset()
            let offsetUser = $(this.userCloneClass).offset()

            let top = offsetBox.top - offsetUser.top
            let left = offsetBox.left - offsetUser.left
            let width = cropBox.clientWidth
            let height = cropBox.clientHeight

            if (~this.nesw.indexOf('n')) {
                top = top + height
                height = -height
            }
            if (~this.nesw.indexOf('w')) {
                left = left + width
                width = -width
            }
            this.cropCoord = { top, left, width, height }
        },
        drawCropper: function (top, left, width, height) {
            if (height < 0) {
                height = -height
                top = top - height
            }
            if (width < 0) {
                width = -width
                left = left - width
            }

            $(this.cropBox).css({ top: top + 'px', left: left + 'px', height: height + 'px', width: width + 'px' })
            $(this.cropInnerimg).css({ top: -top + 'px', left: -left + 'px' })

            if (this.opts.onChange) {
                if (this.init) {
                    this.initQuery.push('onChange')
                }
                else {
                    this.opts.onChange(this.tellSelect(), this)
                }
            }
        },
        detectOver: function (top, left, width, height) {
            let abs = Math.abs
            let userCloneClass = $(this.userCloneClass)[0]
            let opts = this.opts

            let isOverTop = () => { return top + height < 0 }
            let isOverBottom = () => { return top + height > userCloneClass.clientHeight }
            let isOverLeft = () => { return left + width < 0 }
            let isOverRight = () => { return left + width > userCloneClass.clientWidth }

            if (isOverTop()) {
                height = -top
            }
            if (isOverLeft()) {
                width = -left
            }
            if (isOverBottom()) {
                height = userCloneClass.clientHeight - top
            }
            if (isOverRight()) {
                width = userCloneClass.clientWidth - left
            }

            let minSize = opts.minSize
            if (minSize) {
                if (abs(width) < minSize[0]) {
                    width = (width < 0 ? -1 : 1) * minSize[0]
                }
                if (abs(height) < minSize[1]) {
                    height = (height < 0 ? -1 : 1) * minSize[1]
                }
            }

            let maxSize = opts.arMaxSize1 || opts.arMaxSize2 || opts.maxSize
            if (maxSize) {
                if (abs(width) > maxSize[0]) {
                    width = (width < 0 ? -1 : 1) * maxSize[0]
                }
                if (abs(height) > maxSize[1]) {
                    height = (height < 0 ? -1 : 1) * maxSize[1]
                }
            }

            let aspectRatio = opts.aspectRatio
            if (aspectRatio) {
                let hAspectRatio = (height < 0 ? -1 : 1) * 1 / aspectRatio
                let wAspectRatio = (width < 0 ? -1 : 1) * aspectRatio
                height = hAspectRatio * abs(width)

                if (isOverBottom()) {
                    height = userCloneClass.clientHeight - top
                    width = wAspectRatio * abs(height)
                    opts.arMaxSize1 = [abs(width), abs(height)]
                }
                else if (isOverRight()) {
                    width = userCloneClass.clientWidth - left
                    height = hAspectRatio * abs(width)
                    opts.arMaxSize1 = [abs(width), abs(height)]
                }
                else {
                    opts.arMaxSize1 = null
                }

                if (isOverTop()) {
                    height = -top
                    width = wAspectRatio * abs(height)
                    opts.arMaxSize2 = [abs(width), abs(height)]
                }
                else if (isOverLeft()) {
                    width = -left
                    height = hAspectRatio * abs(width)
                    opts.arMaxSize2 = [abs(width), abs(height)]
                }
                else {
                    opts.arMaxSize2 = null
                }
            }
            this.opts = opts

            return [width, height]
        },
        handResize: function (e) {
            let {top, left, height, width} = this.cropCoord
            let nesw = this.nesw

            if (~nesw.indexOf('n') || ~nesw.indexOf('s')) {
                height = this.getY(e) - top
            }
            if (~nesw.indexOf('e') || ~nesw.indexOf('w')) {
                width = this.getX(e) - left
            }

            [width, height] = this.detectOver(top, left, width, height)
            this.drawCropper(top, left, width, height)
        },
        endSelect: function () {
            $(this.cropSqrts).show()

            this.nesw = 'se'
            this.updateStartCoords()
            if (this.cropCoord.height === 0 && this.cropCoord.width === 0) {
                if (this.opts.onRelease) {
                    if (this.init) {
                        // this.initQuery.push('onRelease')
                    }
                    else {
                        this.opts.onRelease(this.tellSelect(), this)
                    }
                }
                $(this.cropBox).hide()
                $(this.cropOpact).css({ opacity: '0' })
            }
            else {
                if (this.opts.onSelect) {
                    if (this.init) {
                        this.initQuery.push('onSelect')
                    }
                    else {
                        this.opts.onSelect(this.tellSelect(), this)
                    }
                }
            }
        },
        moveCropBox: function (offsetX, offsetY) {
            let userNode = $(this.userCloneClass)[0]
            let {top, left, height, width} = this.cropCoord

            top = top - offsetY
            left = left - offsetX

            if (top < 0) {
                top = 0
            }
            else if (top + height >= 0 + userNode.clientHeight) {
                top = userNode.clientHeight - height
            }

            if (left < 0) {
                left = 0
            }
            else if (left + width >= 0 + userNode.clientWidth) {
                left = userNode.clientWidth - width + 0
            }

            this.drawCropper(top, left, width, height)

            if (this.opts.onChange) {
                if (this.init) {
                    this.initQuery('onChange')
                }
                else {
                    this.opts.onChange(this.tellSelect(), this)
                }
            }
        },
        moveCropper: function (e) {
            let offsetX = this.moveStartX - this.getX(e)
            let offsetY = this.moveStartY - this.getY(e)

            this.moveCropBox(offsetX, offsetY)
        },
    }

    return function (userClass, opts, callback) {
        let markClass = '.minicroppermarkclass_' + userClass.replace(/\./g, '_')
        let markCLassCrop = '.minicroppermarkclass_' + userClass.replace(/\./g, '_') + '_cropclass'
        if (document.querySelector(markClass)) {
            let origMaxWidth = $(markClass)[0].dataset.cropattrsW
            let origMaxHeight = $(markClass)[0].dataset.cropattrsH
            $(markCLassCrop)[0].remove()
            // $(markClass).css({'max-width': origMaxWidth, 'max-height': origMaxHeight})
            $(markClass).css({ 'max-width': '', 'max-height': '' })
            $(markClass).show()
            $(markClass)[0].classList.remove(markClass)
        }

        let crop = new MiniCrop(userClass)

        if (typeof opts === 'function' && !callback) {
            callback = opts
            opts = {}
        }

        let readyFn = () => {
            if (opts && !opts.trueSize) {
                opts.trueSize = [$(userClass)[0].naturalWidth, $(userClass)[0].naturalHeight]
            }

            crop.enable(opts)

            if (callback) {
                callback.call(crop, crop)
            }

            for (let value of crop.initQuery) {
                crop.opts[value](crop.tellSelect(), crop)
            }
        }

        let classNode = $(userClass)[0]
        if (classNode && classNode.complete) {
            readyFn()
        }
        else {
            $(userClass).on('load', e => readyFn())
        }
    }
})()