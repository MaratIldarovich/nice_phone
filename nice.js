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

        _getNewPos(newStr, key, pastedText, oldPos){
            var newPos;

            switch (key){
                case 'Backspace':
                    newPos = oldPos - 1;
                    break;
                case 'Delete':
                    newPos = oldPos;
                    break;
                default:
                    newPos = oldPos + ((pastedText && pastedText.length) || 1);
                    break;
            }

            for (let i = 0; i < this.specials.length; i++) {
                let specStr = this.specials[i];

                for (let j = oldPos; j < newPos; j++) {
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

        _isCorrectPos(key) {
            let pos = this.element.selectionStart;
            let diff;

            switch(key){
                case 'ArrowRight':
                    diff = 1;
                    break;
                default:
                    diff = -1;
                    break;
            }

            pos += diff;

            let symOnPos = this.element.value[pos];

            while (this.specials.indexOf(symOnPos) !== -1){
                pos += diff;
                symOnPos = this.element.value[pos];
            }

            return symOnPos !== this.emptyChar && (this.element.selectionStart + diff) >= this.specials[0].length;
        }

        _setMinPos() {
            let minPos = this.element.value.indexOf(this.emptyChar);
            minPos = Math.max(minPos, this.specials[0].length);
            this._setPos(minPos);
        }

        isValid(){
            return this.element.value.replace(this.emptyChar, '').length === this.pattern.length;
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
            

            var splittedPattern = this.pattern.split(PATTERN_NUMBER_SYM);
            this.numOfNumbers = splittedPattern.length - 1;

            splittedPattern
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
                    case 'ArrowRight':
                    case 'Backspace':
                        if (!self._isCorrectPos(e.key)) {
                            e.preventDefault();
                            self._setMinPos();
                        }
                        break;
                }
            });

            el.addEventListener('paste', function (e) {
                self.oldPos = this.selectionStart;
                var cData = e.clipboardData;
                var pastedText = cData.getData('text');
                pastedText = self.filterStr(pastedText);

                if (pastedText.length > self.numOfNumbers){
                    pastedText = pastedText.slice(-self.numOfNumbers);
                }
                
                e.preventDefault();
                var newText = this.value.substr(0,self.oldPos) + pastedText + this.value.substr(self.oldPos + pastedText.length);
                var newStr = self.passStr(newText);
                var newPos = self._getNewPos(newStr, null, pastedText, self.oldPos);
                this.value = newStr;
                self._setPos(newPos, newPos);
            });

            el.addEventListener('input', function (e) {
                var newStr = self.passStr(this.value);
                var newPos = self._getNewPos(newStr, self.lastKey, null, self.oldPos);
                this.value = newStr;
                self._setPos(newPos, newPos);
            });

            this.updateFromRaw('');
        }
    }

    window.NicePhone = NicePhone;
})();