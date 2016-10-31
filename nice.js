/**
 * Creates new instance of nicePhone
 * @param params {Object}
 * @param params.element {HTMLElement}
 * @param params.pattern {String} - pattern of inputed phone
 * @param params.emptyChar {String} - replace empty places in pattern
 * @constructor
 */
class NicePhoneInput {
    filterStr(str) {
        if (str.lastIndexOf(this.specials[0]) === 0) {
            str = str.slice(this.specials[0].length);
        }
        str = str.replace(this.filterRegExp, '');
        return str;
    }

    passStr(userStr, key, pastedText) {
        var str = this.filterStr(userStr);
        var newStr = '';

        var newPos = this.oldPos;

        switch (key){
            case 'Backspace':
                newPos = this.oldPos - 1;
                break;
            case 'Delete':
                newPos = this.oldPos;
                break;
            default:
                newPos = this.oldPos + ((pastedText && pastedText.length) || 1);
                break;
        }

        // если есть параметр emptyChar, полное прохождение строки с заменой n на emptyChar
        for (let i = 0, j = 0; (i < str.length || this.emptyChar) && j < this.pattern.length; i++, j++) {
            let sym = str[i] || this.emptyChar;

            while (this.pattern[j] !== 'n') {
                newStr += this.pattern[j];
                j++;
            }

            newStr += sym;
        }

        for (let i = 0; i < this.specials.length; i++) {
            let specStr = this.specials[i];
            console.log(specStr, this.specials, i);

            for (let j = this.oldPos; j < newPos; j++) {
                let specSymbolAhead = newStr.substr(j, specStr.length) === specStr;
                if (specSymbolAhead) {
                    newPos = newPos + specStr.length;
                }
            }
        }

        return {newPos, newStr};
    }

    updateFromRaw(phone) {
        phone = phone || '';
        this.element.value = this.passStr(phone).newStr;
    }

    _setPos(pos) {
        this.element.setSelectionRange(pos, pos);
    }

    _isCorrectPos() {
        return this.element.selectionStart > this.specials[0].length
    }

    _setMinPos() {
        this._setPos(this.specials[0].length);
    }

    constructor(params) {
        var self = this;
        this.element = params.element;
        this.emptyChar = params.emptyChar || '';
        this.pattern = params.pattern;
        this.lastKey = null;
        this.filterRegExp = /[^0-9]/g;
        this.allowedKeys = ['Delete', 'Backspace', 'ArrowLeft', 'ArrowRight', 'F5'];
        this.oldPos = 0;
        this.specials = [];

        for (let i = 0, j=0; i < this.pattern.length; i++) {
            let sym = this.pattern[i];
            if (sym === 'n') {
                j++;
            }
            else{
                console.log(sym);
                this.specials[j] = this.specials[j] || '';
                this.specials[j] += sym;
            }
        }

        console.log(this.specials);

        this.element.addEventListener('click', function (e) {
            if (!self._isCorrectPos()) {
                self._setMinPos();
            }
        });

        this.element.addEventListener('keydown', function (e) {
            var keyIsNumber = e.key * 1 >= 0;

            if (!e.ctrlKey && self.allowedKeys.indexOf(e.key) === -1 && !keyIsNumber && !e.metaKey) {
                self.lastKey = null;
                e.preventDefault();
                return;
            }

            self.lastKey = e.key;
            self.oldPos = this.selectionStart;
            self.oldStr = this.value;

            switch (e.key) {
                case 'ArrowLeft':
                case 'Backspace':
                    if (!self._isCorrectPos()) {
                        e.preventDefault();
                        self._setMinPos();
                    }
                    break;
            }
        });

        this.element.addEventListener('paste', function (e) {
            this.oldPos = this.selectionStart;
            var cData = e.clipboardData;
            var pastedText = cData.getData('text');
            e.preventDefault();
            var newText = this.value.substr(0,this.oldPos) + pastedText + this.value.substr(this.oldPos + pastedText.length);
            var newData = self.passStr(newText, null, pastedText);
            this.value = newData.newStr;
            self._setPos(newData.newPos, newData.newPos);
        });

        this.element.addEventListener('input', function (e) {
            var newData = self.passStr(this.value, self.lastKey);
            this.value = newData.newStr;
            self._setPos(newData.newPos, newData.newPos);
        });

        this.updateFromRaw(params.defaultRaw);
    }
}