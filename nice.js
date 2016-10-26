/**
 * Creates new instance of nicePhone
 * @param element {HTMLElement}
 * @param params {Object}
 * @param params.pattern {String} - pattern of inputed phone
 * @constructor
 */
function NicePhoneInput(element, params){
    var pos,
        pressedKey,
        oldStr,
        newStr;

    var allowedKeys = ['Delete','Backspace','ArrowLeft','ArrowRight','F5'];

    element.addEventListener('keydown', function(e){
        pos = this.selectionStart;
        oldStr = this.value;
        console.log(oldStr, this, e);
        pressedKey = e.key;

        if (pressedKey === 'ArrowLeft' || pressedKey === 'ArrowRight'){
            //setMinPos();
        }

        if (!e.ctrlKey && allowedKeys.indexOf(pressedKey) === -1 && !(pressedKey * 1 >= 0) && !e.metaKey){
            e.preventDefault();
        }

        //e.preventDefault();
    });
}