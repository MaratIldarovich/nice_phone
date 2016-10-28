/**
 * Creates new instance of nicePhone
 * @param params {Object}
 * @param params.element {HTMLElement}
 * @param params.pattern {String} - pattern of inputed phone
 * @constructor
 */
function NicePhoneInput(params){
    let element = params.element,
        pattern = params.countryCode + params.pattern,
        filter = new RegExp(`^${params.countryCode}/[^0-9]/g`),
        allowedKeys = ['Delete','Backspace','ArrowLeft','ArrowRight','F5'],
        oldPos;

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
        console.log(pastedText);
    });

    function patternSymIsNotANumber(indx){
        return pattern[indx] !== 'n';
    }

    element.addEventListener('input', function(e){
        console.log('input', e);
        var str = this.value.replace(filter, '');
        console.log(str, filter);
        var newStr = '';
        var newPos = oldPos + 1;

        for (var i = 0, j = 0; i < str.length && j < pattern.length; i++, j++) {
            let sym = str[i];

            while (patternSymIsNotANumber(j)){
                newStr += pattern[j];
                j++;
                if (newPos === j) newPos++;
            }

            newStr += sym;
        }

        this.value = newStr;
        this.setSelectionRange(newPos, newPos);
    });
}