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
        oldStr;

    var allowedKeys = ['Delete','Backspace','ArrowLeft','ArrowRight','F5'];
    var blocks = params.pattern.split('{').map((block)=> block.split('}'));
    console.log(blocks);

    element.addEventListener('keydown', function(e){
        pos = this.selectionStart;
        oldStr = this.value;
        console.log(window['testInput'] = this, 'down');
        pressedKey = e.key;

        if (pressedKey === 'ArrowLeft' || pressedKey === 'ArrowRight'){
            //setMinPos();
        }

        if (!e.ctrlKey && allowedKeys.indexOf(pressedKey) === -1 && !(pressedKey * 1 >= 0) && !e.metaKey){
            e.preventDefault();
        }

        //e.preventDefault();
    });

    element.addEventListener('input', function(e){
        console.log('input');
        // if (this.value){
        //     var newValue = '';
        //     var newStr = this.value;
        //     blocks.every((block, indx, arr)=>{
        //         if (indx === 0){
        //             newValue += block[0];
        //         }
        //         else{
        //             //newValue += newStr.slice()block[0] + (block[1] || '');
        //         }
        //     });
        //
        //     var newPos;
        //
        //     var pastedText = null;
        //
        //     switch (pressedKey){
        //         case 'Backspace':
        //             newPos = pos - 1;
        //             break;
        //         case 'Delete':
        //             newPos = pos;
        //             break;
        //         default:
        //             newPos = pos + ((pastedText && pastedText.length) || 1);
        //
        //             for (let i = 0; i < specials.length; i++) {
        //                 var str = specials[i];
        //
        //                 for (let j = pos; j < newPos; j++) {
        //                     let specSymbolAhead = newStr.substr(j, str.length) === str;
        //                     if (specSymbolAhead) {
        //                         newPos = newPos + str.length;
        //                     }
        //                 }
        //             }
        //             break;
        //     }
        //
        //     if (oldStr && (pos < oldStr.length)){
        //         this.setSelectionRange(newPos, newPos);
        //     }
        // }
    });
}