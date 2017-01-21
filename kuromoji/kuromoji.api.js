'use strict';

function normalizeStrForAnalize(str) {
    let isKanjiKana = function (str = '') {
        return !!str.match(/[\u4E00-\u9FAF\u3040-\u3096\u30A1-\u30FA\uFF66-\uFF9D\u31F0-\u31FF「」、？ー]/)
    }

    let newStr = ''
    for (let i = 0; i < str.length; i++) {
        newStr += str[i]
        if (!isKanjiKana(str[i]) && isKanjiKana(str[i + 1])) {
            newStr += ' '
        }
    }
    return newStr
}
