(function(){
    const FILTER_REG_EXP = /[^0-9]/g;
    const ALLOWED_KEYS = {
        'Delete' : [46],
        'Backspace' : [8],
        'ArrowLeft' : [37],
        'ArrowRight' : [39],
        'F5' : [116],
        'number' : [48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105]

    };
    const PATTERN_NUMBER_SYM = 'n';
    const KEYS_NAMES = Object.keys(ALLOWED_KEYS);
    
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
            str = str.replace(FILTER_REG_EXP, '');
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

        _getNewPos(newStr, key, pastedText, curPos){
            var newPos,
                oldPos;

            switch (key){
                case 'Backspace':
                    oldPos = curPos + 1;
                    newPos = curPos;
                    break;
                case 'Delete':
                    newPos = curPos;
                    oldPos = curPos;
                    break;
                default:
                    newPos = curPos;
                    oldPos = curPos - 1;
                    if (pastedText){
                        newPos += pastedText.length;
                    }
                    break;
            }

            for (let j = oldPos; j < newPos; j++) {
                for (let i = 0; i < this.specials.length; i++) {
                    let specStr = this.specials[i];
                    let specSymbolAhead = newStr.substr(j, specStr.length) === specStr;
                    if (specSymbolAhead) {
                        newPos = newPos + specStr.length;
                    }
                }
            }



            return newPos;
        }

        _getPos(){
            return this.element.selectionStart;
        }
        
        _setPos(pos) {
            this.element.selectionStart = pos;
            this.element.selectionEnd = pos;
        }

        _isCorrectPos(key, pos) {
            pos = pos || this._getPos();
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

            return symOnPos !== this.emptyChar && (this._getPos() + diff) >= this.specials[0].length;
        }

        _getMinPos() {
            let minPos = this.element.value.indexOf(this.emptyChar);
            minPos = Math.max(minPos, this.specials[0].length);
            return minPos;
        }

        isValid(){
            return this.element.value.replace(this.emptyChar, '').length === this.pattern.length;
        }

        constructor(params) {
            this.element = params.element;
            this.emptyChar = params.emptyChar || '';
            this.pattern = params.pattern;
            this.specials = [];

            var self = this,
                el = this.element;
            

            var splittedPattern = this.pattern.split(PATTERN_NUMBER_SYM);
            this.numOfNumbers = splittedPattern.length - 1;

            splittedPattern
                .forEach((str, indx)=> {
                    this.specials = this.specials.concat(indx === 0 ? str : str.split(''));
                });

            this.specials = this.specials.filter((sym, indx, arr)=> sym && arr.indexOf(sym) === indx);

            el.addEventListener('click', function (e) {
                if (!self._isCorrectPos()) {
                    self._setPos(self._getMinPos());
                }
            });

            el.addEventListener('keydown', function (e) {
                var key = e.key;

                if (!key){
                    let code = e.keyCode || e.which;
                    KEYS_NAMES.every((keyName)=> {
                        if (ALLOWED_KEYS[keyName].indexOf(code) !== -1){
                            key = keyName;
                            return false;
                        }
                        return true;
                    })
                }

                var keyIsNumber = (key * 1 >= 0) || key === 'number';

                if (!e.ctrlKey && KEYS_NAMES.indexOf(key) === -1 && !keyIsNumber && !e.metaKey) {
                    e.preventDefault();
                    return;
                }

                self.lastKey = key;

                switch (key) {
                    case 'Backspace':
                    case 'ArrowLeft':
                    case 'ArrowRight':
                        if (!self._isCorrectPos(key)) {
                            e.preventDefault();
                            self._setPos(self._getMinPos());
                        }
                        break;
                }
            });

            el.addEventListener('paste', function (e) {
                var curPos = self._getPos();
                var cData = e.clipboardData;
                var pastedText = cData.getData('text');
                pastedText = self.filterStr(pastedText);

                if (pastedText.length > self.numOfNumbers){
                    pastedText = pastedText.slice(-self.numOfNumbers);
                }
                
                e.preventDefault();
                var newText = this.value.substr(0,curPos) + pastedText + this.value.substr(curPos + pastedText.length);
                var newStr = self.passStr(newText);
                var newPos = self._getNewPos(newStr, null, pastedText, curPos);
                this.value = newStr;
                self._setPos(newPos, newPos);
            });

            el.addEventListener('input', function (e) {
                var newStr = self.passStr(this.value);
                var newPos = self._getNewPos(newStr, self.lastKey, null, self._getPos());
                this.value = newStr;
                self._setPos(newPos, newPos);
            });

            this.updateFromRaw('');
        }
    }

    window.NicePhone = NicePhone;
})();