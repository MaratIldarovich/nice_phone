(function(){
    const filterRegExp = /[^0-9]/g;
    const allowedKeys = ['Delete', 'Backspace', 'ArrowLeft', 'ArrowRight', 'F5'];
    const PATTERN_NUMBER_SYM = 'n';

    /**
     * Creates new instance of nicePhone
     * @param params {Object}
     * @param params.element {HTMLElement}
     * @param params.pattern {String} - pattern of inputed phone
     * @param params.emptyChar {String} - replace empty places in pattern
     * @param params.defaultRaw {String}
     * @constructor
     */
    class NicePhone {
        filterStr(str) {
            if (str.lastIndexOf(this.specials[0]) === 0) {
                str = str.slice(this.specials[0].length);
            }
            str = str.replace(filterRegExp, '');
            return str;
        }

        passStr(userStr) {
            var str = this.filterStr(userStr);
            var newStr = '';

            // если есть параметр emptyChar, полное прохождение строки с заменой n на emptyChar
            for (let i = 0, j = 0; (i < str.length || this.emptyChar) && j < this.pattern.length; i++, j++) {
                let sym = str[i] || this.emptyChar;

                while (this.pattern[j] !== PATTERN_NUMBER_SYM) {
                    newStr += this.pattern[j];
                    j++;
                }

                newStr += sym;
            }

            return newStr;
        }

        updateFromRaw(phone) {
            phone = phone || '';
            this.element.value = this.passStr(phone);
        }

        _getNewPos(newStr, key, pastedText){
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

            for (let i = 0; i < this.specials.length; i++) {
                let specStr = this.specials[i];

                for (let j = this.oldPos; j < newPos; j++) {
                    let specSymbolAhead = newStr.substr(j, specStr.length) === specStr;
                    if (specSymbolAhead) {
                        newPos = newPos + specStr.length;
                    }
                }
            }

            return newPos;
        }

        _setPos(pos) {
            this.element.setSelectionRange(pos, pos);
        }

        _isCorrectPos() {
            if (this.emptyChar){
                let pos = this.element.selectionStart - 1;
                let symOnPos = this.element.value[pos];

                while (this.specials.indexOf(symOnPos) !== -1){
                    pos--;
                    symOnPos = this.element.value[pos];
                }

                return symOnPos !== this.emptyChar
            }
            else{
                return this.element.selectionStart > this.specials[0].length
            }
        }

        _setMinPos() {
            if (this.emptyChar){
                this._setPos(this.element.value.indexOf(this.emptyChar));
            }
            else{
                this._setPos(this.specials[0].length);
            }
        }

        isValid(){
            return this.element.value.length === this.pattern.length;
        }

        constructor(params) {
            this.element = params.element;
            this.emptyChar = params.emptyChar || '';
            this.pattern = params.pattern;
            this.lastKey = null;
            this.oldPos = 0;
            this.specials = [];

            var self = this,
                el = this.element;
            

            this.pattern
                .split(PATTERN_NUMBER_SYM)
                .filter((sym, indx, arr)=> sym && arr.indexOf(sym) === indx)
                .forEach((str, indx)=> {
                    this.specials = this.specials.concat(indx === 0 ? str : str.split(''));
                });

            el.addEventListener('click', function (e) {
                if (!self._isCorrectPos()) {
                    self._setMinPos();
                }
            });

            el.addEventListener('keydown', function (e) {
                var keyIsNumber = e.key * 1 >= 0;

                if (!e.ctrlKey && allowedKeys.indexOf(e.key) === -1 && !keyIsNumber && !e.metaKey) {
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

            el.addEventListener('paste', function (e) {
                this.oldPos = this.selectionStart;
                var cData = e.clipboardData;
                var pastedText = cData.getData('text');
                e.preventDefault();
                var newText = this.value.substr(0,this.oldPos) + pastedText + this.value.substr(this.oldPos + pastedText.length);
                var newStr = self.passStr(newText);
                var newPos = self._getNewPos(newStr, null, pastedText);
                this.value = newStr;
                self._setPos(newPos, newPos);
            });

            el.addEventListener('input', function (e) {
                var newStr = self.passStr(this.value);
                var newPos = self._getNewPos(newStr, self.lastKey);
                this.value = newStr;
                self._setPos(newPos, newPos);
            });

            this.updateFromRaw(params.defaultRaw);
        }
    }

    window.NicePhone = NicePhone;
})();