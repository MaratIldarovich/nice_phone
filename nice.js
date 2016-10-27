/**
 * Creates new instance of nicePhone
 * @param element {HTMLElement}
 * @param params {Object}
 * @param params.pattern {String} - pattern of inputed phone
 * @constructor
 */
function NicePhoneInput(element, params){
    var oldPos;

    element.addEventListener('keydown', function(e){
        if (!e.ctrlKey && allowedKeys.indexOf(e.key) === -1 && !(e.key * 1 >= 0) && !e.metaKey){
            e.preventDefault();
            return;
        }

        oldPos = this.selectionStart;
    });

    var allowedKeys = ['Delete','Backspace','ArrowLeft','ArrowRight','F5'];

    element.addEventListener('input', function(e){
        var str = this.value.replace(/[^0-9]/g, '');
        var newStr = '';
        var newPos = oldPos + 1;
        for (var i = 0, j = 0; i < str.length && j < params.pattern.length; i++, j++) {
            let sym = str[i];
            let patternSym = params.pattern[j];
            let patternSymIsNotANumber = !(patternSym * 1);
            if (patternSymIsNotANumber){
                newStr += patternSym;
                j++;
            }

            newStr += sym;
        }

        this.value = newStr;
        this.setSelectionRange(newPos, newPos);
    });
}