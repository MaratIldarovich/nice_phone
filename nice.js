/**
 * Creates new instance of nicePhone
 * @param params {Object}
 * @param params.element {HTMLElement}
 * @param params.pattern {String} - pattern of inputed phone
 * @constructor
 */
function NicePhoneInput(params){
    let element = params.element,
        emptyChar = params.emptyChar,
        pattern = params.pattern,
        filterRegExp = /[^0-9]/g,
        firstSyms = '',
        allowedKeys = ['Delete','Backspace','ArrowLeft','ArrowRight','F5'],
        oldPos = 0;

    for (var i = 0; i < pattern.length; i++) {
        let sym = pattern[i];
        if (sym === 'n') break;
        firstSyms += sym;
    }

    function filterStr(str){
        if (str.lastIndexOf(firstSyms) === 0){
            str = str.slice(firstSyms.length);
        }
        str = str.replace(filterRegExp,'')
        return str;
    }

    function passStr(str){
        str = filterStr(str);
        var newStr = '';
        var newPos = oldPos + 1;

        for (var i = 0, j = 0; (i < str.length || emptyChar) && j < pattern.length; i++, j++) {
            let sym = str[i] || emptyChar;

            while (pattern[j] !== 'n'){
                newStr += pattern[j];
                j++;
                if (newPos === j) newPos++;
            }

            newStr += sym;
        }

        return {newPos, newStr};
    }

    element.addEventListener('keydown', function(e){
        var keyIsNumber = e.key * 1 >= 0;

        if (!e.ctrlKey && allowedKeys.indexOf(e.key) === -1 && !keyIsNumber && !e.metaKey){
            e.preventDefault();
            return;
        }

        oldPos = this.selectionStart;
    });

    element.addEventListener('paste', function(e){
        oldPos = this.selectionStart;
        var cData = e.clipboardData;
        var pastedText = cData.getData('text');
    });

    element.addEventListener('input', function(e){
        var data = passStr(this.value);

        this.value = data.newStr;
        this.setSelectionRange(data.newPos, data.newPos);
    });
}