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
        if (str.lastIndexOf(this.firstSyms) === 0) {
            str = str.slice(this.firstSyms.length);
        }
        str = str.replace(this.filterRegExp, '')
        return str;
    }

    passStr(userStr, key) {
        var str = this.filterStr(userStr);
        var newStr = '';
        var newPos = this.curPos;

        switch (key) {
            case 'Backspace':
                newPos--;
                //str = str.slice(-1);
                break;
            case 'Delete':
                //str = str.slice(-1);
                break;
            default:
                newPos++;
                break;
        }

        // если есть параметр emptyChar, полное прохождение строки с заменой n на emptyChar
        for (var i = 0, j = 0; (i < str.length || this.emptyChar) && j < this.pattern.length; i++, j++) {
            let sym = str[i] || this.emptyChar;

            while (this.pattern[j] !== 'n') {
                newStr += this.pattern[j];
                j++;
                if (newPos === j) {
                    switch (key) {
                        case 'Backspace':
                            newPos--;
                            break;
                        case 'Delete':
                            break;
                        default:
                            newPos++;
                            break;
                    }
                }
            }

            newStr += sym;
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
        return this.curPos > this.firstSyms.length
    }

    _setMinPos() {
        this._setPos(this.firstSyms.length);
    }

    constructor(params) {
        var self = this;
        this.element = params.element;
        this.emptyChar = params.emptyChar || '';
        this.pattern = params.pattern;
        this.lastKey = null;
        this.filterRegExp = /[^0-9]/g;
        this.firstSyms = '';
        this.allowedKeys = ['Delete', 'Backspace', 'ArrowLeft', 'ArrowRight', 'F5'];
        this.curPos = 0;
        this.oldStr = '';

        for (var i = 0; i < this.pattern.length; i++) {
            let sym = this.pattern[i];
            if (sym === 'n') break;
            this.firstSyms += sym;
        }

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
            
            switch (e.key) {
                case 'ArrowLeft':
                    if (!self._isCorrectPos()) {
                        e.preventDefault();
                        self._setMinPos();
                    }
                    break;
            }

            self.lastKey = e.key;
            self.curPos = this.selectionStart;
            self.oldStr = this.value;
        });

        this.element.addEventListener('paste', function (e) {
            self.curPos = this.selectionStart;
            var cData = e.clipboardData;
            var pastedText = cData.getData('text');
        });

        this.element.addEventListener('input', function (e) {
            var data = self.passStr(this.value, self.lastKey);
            this.value = data.newStr;
            self._setPos(data.newPos, data.newPos);
        });

        this.updateFromRaw(params.defaultRaw);
    }
}