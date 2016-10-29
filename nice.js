/**
 * Creates new instance of nicePhone
 * @param params {Object}
 * @param params.element {HTMLElement}
 * @param params.pattern {String} - pattern of inputed phone
 * @constructor
 */
function NicePhoneInput(params){
    let element = params.element,
        pattern = params.pattern,
        firstSyms = '',
        allowedKeys = ['Delete','Backspace','ArrowLeft','ArrowRight','F5'],
        oldPos;

    for (var i = 0; i < pattern.length; i++) {
        let sym = pattern[i];
        if (sym === 'n') break;
        firstSyms += sym;
    }

    pattern = deleteFirstSyms(pattern);
    console.log(pattern);

    element.addEventListener('keydown', function(e){
        if (!e.ctrlKey && allowedKeys.indexOf(e.key) === -1 && !(e.key * 1 >= 0) && !e.metaKey){
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

    function deleteFirstSyms(str){
        if (str.lastIndexOf(firstSyms) === 0){
            str = str.slice(firstSyms.length);
        }
        return str;
    }

    function processStr(str){
        str = deleteFirstSyms(str);
        str = str.replace(/[^0-9]/g,'');
        var newStr = '';
        var newPos = oldPos + 1;

        for (var i = 0, j = 0; i < str.length && j < pattern.length; i++, j++) {
            let sym = str[i];

            while (pattern[j] !== 'n'){
                newStr += pattern[j];
                j++;
                if (newPos === j) newPos++;
            }

            newStr += sym;
        }

        newStr = firstSyms + newStr;

        return {newPos, newStr};
    }

    element.addEventListener('input', function(e){
        var data = processStr(this.value);

        this.value = data.newStr;
        this.setSelectionRange(data.newPos, data.newPos);
    });
}