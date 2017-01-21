var $ = (function() {
    let MiniJquery = function(arr) {
        this.length = arr.length
        for (let i = 0; i < this.length; i++) {
            this[i] = arr[i]
        }

        return this
    }

    MiniJquery.prototype = {
        doClass: function(className, action) {
            let classes = ~className.indexOf(' ') ? className.split(' ') : [className]
            for (let i = 0; i < this.length; i++) {
                for (let j = 0; j < classes.length; j++) {
                    this[i].classList[action](classes[j])
                }
            }
            return this
        },
        addClass: function(className) {
            return this.doClass(className, 'add')
        },
        removeClass: function(className) {
            return this.doClass(className, 'remove')
        },
        toggleClass: function(className) {
            return this.doClass(className, 'toggle')
        },
        hide: function() {
            for (let i = 0; i < this.length; i++) {
                this[i].style.display = 'none'
            }
            return this
        },
        //show не работает, если у объекта был display: none;
        // this[i].style.display = 'block' нельзя написать, потому что там мог быть flex
        show: function() {
            for (let i = 0; i < this.length; i++) {
                this[i].style.display = ''
            }
            return this
        },
        focus: function() {
            for (let i = 0; i < this.length; i++) {
                this[i].focus()
            }
            return this
        },
        append: function(newInnerHTML) {
            if (newInnerHTML) {
                for (let i = 0; i < this.length; i++) {
                    let htmlTypeof = typeof newInnerHTML
                    if (htmlTypeof === 'string' || htmlTypeof === 'number') {
                        this[i].insertAdjacentHTML('beforeend', newInnerHTML)
                    }
                    else if (newInnerHTML instanceof MiniJquery) {
                        for (let j = 0; j < newInnerHTML.length; j++) {
                            this[i].appendChild(newInnerHTML[j])
                        }
                    }
                    else {
                        this[i].appendChild(newInnerHTML)
                    }
                }
            }
            return this
        },
        after: function(newInnerHTML) {
            if (newInnerHTML) {
                for (let i = 0; i < this.length; i++) {
                    let htmlTypeof = typeof newInnerHTML
                    if (htmlTypeof === 'string' || htmlTypeof === 'number') {
                        this[i].insertAdjacentHTML('afterend', newInnerHTML)
                    }
                    else if (newInnerHTML instanceof MiniJquery) {
                        for (let j = 0; j < newInnerHTML.length; j++) {
                            if (this[i].parentNode) {
                                this[i].parentNode.appendChild(newInnerHTML[j])
                            }
                        }
                    }
                    else {
                        if (this[i].parentNode) {
                            this[i].parentNode.appendChild(newInnerHTML)
                        }
                    }
                }
            }
            return this
        },
        onoff: function(eventName, eventAction, type) {
            var events = eventName.split(' ')
            for (let i = 0; i < this.length; i++) {
                for (let j = 0; j < events.length; j++) {
                    this[i][type](events[j], eventAction)
                }
            }
            return this
        },
        on: function(eventName, eventAction) {
            return this.onoff(eventName, eventAction, 'addEventListener')
        },
        off: function(eventName, eventAction) {
            return this.onoff(eventName, eventAction, 'removeEventListener')
        },
        htmlval: function(value, type) {
            if (value || value === '') {
                for (let i = 0; i < this.length; i++) {
                    this[i][type] = value
                }
                return this
            }
            else {
                return this[0] ? this[0][type] : null
            }
        },
        html: function(html) {
            return this.htmlval(html, 'innerHTML')
        },
        val: function(value) {
            return this.htmlval(value, 'value')
        },
        remove: function() {
            for (let i = 0; i < this.length; i++) {
                if (this[i].parentNode) {
                    this[i].parentNode.removeChild(this[i])
                }
            }
            return this
        },
        css: function(props, value) {
            let val = value === void 0
            if (val) {
                if (typeof props === 'string' && this[0]) {
                    return window.getComputedStyle(this[0], null).getPropertyValue(props)
                }
                else {
                    for (let i = 0; i < this.length; i++) {
                        for (let prop in props) {
                            this[i].style[prop] = props[prop]
                        }
                    }
                }
            }
            else if (!val && typeof props === 'string') {
                for (let i = 0; i < this.length; i++) {
                    this[i].style[props] = value
                }
            }
            return this
        },
        prop: function(props, value) {
            if (arguments.length === 1 && typeof props === 'string') {
                // Get prop
                if (this[0]) return this[0][props];
                else return undefined;
            }
            else {
                // Set props
                for (var i = 0; i < this.length; i++) {
                    if (arguments.length === 2) {
                        // String
                        this[i][props] = value;
                    }
                    else {
                        // Object
                        for (var propName in props) {
                            this[i][propName] = props[propName];
                        }
                    }
                }
                return this;
            }
        },
        data: function(key, value) {
            if (typeof value === 'undefined') {
                // Get value
                if (this[0]) {
                    if (this[0].dom7ElementDataStorage && (key in this[0].dom7ElementDataStorage)) {
                        return this[0].dom7ElementDataStorage[key];
                    }
                    else {
                        var dataKey = this[0].getAttribute('data-' + key);
                        if (dataKey) {
                            return dataKey;
                        }
                        else return undefined;
                    }
                }
                else return undefined;
            }
            else {
                // Set value
                for (var i = 0; i < this.length; i++) {
                    var el = this[i];
                    if (!el.dom7ElementDataStorage) el.dom7ElementDataStorage = {};
                    el.dom7ElementDataStorage[key] = value;
                }
                return this;
            }
        },
        removeData: function(key) {
            for (var i = 0; i < this.length; i++) {
                var el = this[i];
                if (el.dom7ElementDataStorage && el.dom7ElementDataStorage[key]) {
                    el.dom7ElementDataStorage[key] = null;
                    delete el.dom7ElementDataStorage[key];
                }
            }
        },
        dataset: function() {
            var el = this[0];
            if (el) {
                var dataset = {};
                if (el.dataset) {
                    for (var dataKey in el.dataset) {
                        dataset[dataKey] = el.dataset[dataKey];
                    }
                }
                else {
                    for (var i = 0; i < el.attributes.length; i++) {
                        var attr = el.attributes[i];
                        if (attr.name.indexOf('data-') >= 0) {
                            dataset[$.toCamelCase(attr.name.split('data-')[1])] = attr.value;
                        }
                    }
                }
                for (var key in dataset) {
                    if (dataset[key] === 'false') dataset[key] = false;
                    else if (dataset[key] === 'true') dataset[key] = true;
                    else if (parseFloat(dataset[key]) === dataset[key] * 1) dataset[key] = dataset[key] * 1;
                }
                return dataset;
            }
            else return undefined;
        },
        offset: function() {
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
        dropzone: function(hoverClass, callback) {
        	if(typeof callback === 'undefined') {
        		callback = hoverClass
        		hoverClass = null
        	}
            let dropzoneTimeout = null
            this.on('dragenter dragover', (e) => {
                e.preventDefault()
                clearTimeout(dropzoneTimeout)
                hoverClass && this.addClass(hoverClass)
            })

            this.on('dragleave', (e) => {
                e.preventDefault()
                clearTimeout(dropzoneTimeout)
                dropzoneTimeout = setTimeout(() => {
                    hoverClass && this.removeClass(hoverClass)
                }, 50)

            })

            this.on('drop', (e) => {
                e.preventDefault()
                clearTimeout(dropzoneTimeout)
                hoverClass && this.removeClass(hoverClass)

                callback(e)
            })
        },
        resizeImage: function(w) {
            let result

            // canvas.imageSmoothingEnabled = false
            // canvas.imageSmoothingQuality = 'high'
            // canvas.webkitImageSmoothingEnabled = false
            // canvas.webkitImageSmoothingQuality = 'high'

            if(this[0] && this[0].tagName === 'IMG') {
                let img = this[0]

                let h = Math.round(w * img.height / img.width)

                let tempImg = document.createElement('img')
                tempImg.src = img.src
                let steps = Math.ceil(Math.log(tempImg.width / w) / Math.LN2)
                let sW = w * Math.pow(2, steps - 1)
                let sH = h * Math.pow(2, steps - 1)

                for (let i = 0; i < steps; i++) {
                    let canvas = document.createElement('canvas')
                    canvas.width = sW
                    canvas.height = sH
                    canvas.getContext('2d').drawImage(tempImg, 0, 0, sW, sH)
                    tempImg = canvas

                    sW = Math.round(sW / 2)
                    sH = Math.round(sH / 2)
                }

                result = tempImg
            }
            else if(this[0] && this[0].tagName === 'CANVAS') {
                let canvasOrig = this[0]

                let h = Math.round(w * canvasOrig.height / canvasOrig.width)

                let tempImg = canvasOrig
                let steps = Math.ceil(Math.log(tempImg.width / w) / Math.LN2)
                let sW = w * Math.pow(2, steps - 1)
                let sH = h * Math.pow(2, steps - 1)

                for (let i = 0; i < steps; i++) {
                    let canvas = document.createElement('canvas')
                    canvas.width = sW
                    canvas.height = sH
                    canvas.getContext('2d').drawImage(tempImg, 0, 0, sW, sH)
                    tempImg = canvas

                    sW = Math.round(sW / 2)
                    sH = Math.round(sH / 2)
                }

                result = tempImg
            }
            return result
        },
    }

    let miniJquery = function(selector, context) {
        if (selector instanceof MiniJquery) {
            return selector
        }
        if(!selector) {
            return
        }

        let arr = []
        if (selector[0] === '<') {
            arr = [document.createElement(selector.slice(1, -1))]
        }
        else if (selector.nodeType || selector === window || selector === document) {
            arr.push(selector)
        }
        else {
            arr = document.querySelectorAll(selector)
        }
        return new MiniJquery(arr)
    }

    return miniJquery
})()