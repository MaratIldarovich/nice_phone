const FILTER_REG_EXP = /[^0-9]/g;
const ALLOWED_KEYS = {
    'Delete': [46],
    'Backspace': [8],
    'ArrowLeft': [37],
    'ArrowRight': [39],
    'F5': [116],
    'number': [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105]
};
const PATTERN_NUMBER_SYM = 'n';
const KEYS_NAMES = Object.keys(ALLOWED_KEYS);

class NicePhone {
    deleteStartSpecSyms(str) {
        let startSpecStr = this.specials[0];

        for (let i = 0; i < startSpecStr.length; i++) {
            if (startSpecStr[i] === str[i]) {
                str = str.substr(1);
                startSpecStr = startSpecStr.substr(1);
            } else {
                break;
            }
        }

        return str;
    }

    filterByRegExp(str) {
        return str.replace(FILTER_REG_EXP, '');
    }

    filterStr(str) {
        return this.filterByRegExp(this.deleteStartSpecSyms(str));
    }

    passStr(userStr) {
        let str = this.filterStr(userStr);
        let minStrLength = this.specials[0].length;

        let newStr = '';

        // если есть параметр emptyChar, полное прохождение строки с заменой n на emptyChar
        for (let i = 0, j = 0;
             ((i < (str.length || minStrLength)) || this.emptyChar) && j < this.pattern.length;
             i++, j++) {
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
        let newVal = this.passStr(phone);
        this.element.value = newVal;
        if (typeof this.changeCallback === 'function') {
            this.changeCallback(newVal, null);
        }
    }

    getPos() {
        return this.element.selectionStart;
    }

    setPos(pos) {
        this.element.selectionStart = pos;
        this.element.selectionEnd = pos;
    }

    setMinPos() {
        this.setPos(this._getMinPos());
    }

    focus() {
        this.element.focus();
        this.setMinPos();
    }

    _getNewPos(newStr, key, pastedText, curPos) {
        let newPos,
            oldPos;

        switch (key) {
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
                if (pastedText) {
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

    _isCorrectPos(key, pos) {
        pos = pos || this.getPos();
        let diff;

        switch (key) {
            case 'ArrowRight':
                diff = 1;
                break;
            default:
                diff = -1;
                break;
        }

        pos += diff;

        let symOnPos = this.element.value[pos];

        while (this.specials.indexOf(symOnPos) !== -1) {
            pos += diff;
            symOnPos = this.element.value[pos];
        }

        return symOnPos !== this.emptyChar && (this.getPos() + diff) >= this.specials[0].length;
    }

    _getMinPos() {
        let minPos = this.element.value.indexOf(this.emptyChar);
        minPos = Math.max(minPos, this.specials[0].length);
        return minPos;
    }

    isValid() {
        return this.element.value.replace(this.emptyChar, '').length === this.pattern.length;
    }

    onClick() {
        if (!this._isCorrectPos()) {
            this.setPos(this._getMinPos());
        }
    }

    onKeyDown(keyboardEvent) {
        let {key} = keyboardEvent;

        if (!key) {
            let code = keyboardEvent.keyCode || keyboardEvent.which;
            KEYS_NAMES.every((keyName) => {
                if (ALLOWED_KEYS[keyName].indexOf(code) !== -1) {
                    key = keyName;
                    return false;
                }
                return true;
            })
        }

        let keyIsNumber = (key * 1 >= 0) || key === 'number';

        if (!keyboardEvent.ctrlKey && KEYS_NAMES.indexOf(key) === -1 && !keyIsNumber && !keyboardEvent.metaKey) {
            keyboardEvent.preventDefault();
            return;
        }

        this.lastKey = key;

        if (this.destroyed) return;

        switch (key) {
            case 'Backspace':
                if (!this._isCorrectPos(key)) {
                    keyboardEvent.preventDefault();
                    this.backSpaceHits[1] = this.backSpaceHits[0] && !this.backSpaceHits[1] ?
                        event.timeStamp : this.backSpaceHits[1];

                    this.backSpaceHits[0] = !this.backSpaceHits[0] ?
                        keyboardEvent.timeStamp : this.backSpaceHits[0];

                    let dif = this.backSpaceHits[1] - this.backSpaceHits[0];

                    if (this.backSpaceHits[1] && dif < 600) {
                        this.destroyMask();
                        this.backSpaceHits = [0, 0];
                        this.element.value = '';
                    }

                    if (!this.backSpaceHits[1]) {
                        setTimeout(() => {
                            this.backSpaceHits = [0, 0];
                        }, 650);
                    }
                }
                break;
            case 'ArrowLeft':
            case 'ArrowRight':
                if (!this._isCorrectPos(key)) {
                    keyboardEvent.preventDefault();
                    this.setPos(this._getMinPos());
                }
                break;
        }
    }

    onPaste(event) {
        let curPos = this.getPos();
        let {clipboardData} = event;
        let pastedText = clipboardData.getData('text');
        pastedText = this.filterStr(pastedText);

        if (pastedText.length > this.numOfNumbers) {
            pastedText = pastedText.slice(-this.numOfNumbers);
        }

        event.preventDefault();
        let newText = this.element.value.substr(0, curPos) + pastedText +
            this.element.value.substr(curPos + pastedText.length);
        let newStr = this.passStr(newText);
        let newPos = this._getNewPos(newStr, null, pastedText, curPos);
        this.element.value = newStr;
        this.setPos(newPos);

        if (typeof this.changeCallback === 'function') {
            this.changeCallback(newStr, newPos);
        }
    }

    onInput() {
        let newStr, newPos;

        if (!this.destroyed) {
            newStr = this.passStr(this.element.value);
            newPos = this._getNewPos(newStr, this.lastKey, null, this.getPos());
            this.element.value = newStr;
            this.setPos(newPos);
        } else {
            newStr = this.element.value;
            newPos = this.getPos();
        }

        if (typeof this.changeCallback === 'function') {
            this.changeCallback(newStr, newPos);
        }

        if (typeof this.successCallback === 'function' &&
            this.filterByRegExp(newStr).length === this.numOfNumbers) {
            this.successCallback();
        }
    }

    destroyMask() {
        this.element.removeEventListener('click', this.events['click']);
        this.element.removeEventListener('paste', this.events['paste']);
        this.destroyed = true;
    }

    /**
     * Creates new instance of nicePhone
     * @param params {Object}
     * @param params.element {HTMLElement}
     * @param params.pattern {String} - pattern of inputed phone
     * @param params.emptyChar {String} - replace empty places in pattern
     * @param params.changeCallback {Function} - invoke callback when input change.
     * @param params.successCallback {Function} - invoke callback when success input.
     * @param params.canDestroyMask {boolean} - user can destroy mask when fast double back-space.
     * @constructor
     */
    constructor(params) {
        this.element = params.element;
        this.emptyChar = params.emptyChar || '';
        this.pattern = params.pattern;
        this.changeCallback = params.changeCallback || null;
        this.successCallback = params.successCallback || null;
        if (typeof params.canDestroyMask === 'undefined') {
            this.canDestroyMask = true;
        } else {
            this.canDestroyMask = params.canDestroyMask;
        }
        this.specials = [];
        this.backSpaceHits = [];
        this.destroyed = false;

        let splittedPattern = this.pattern.split(PATTERN_NUMBER_SYM);
        this.numOfNumbers = splittedPattern.length - 1;

        for (let i = 0; i < this.pattern.length; i++) {
            if (this.pattern[i] !== ' ') {
                let sym = this.pattern[i] * 1;
                if (!isNaN(sym) && typeof sym === 'number') {
                    this.numOfNumbers++;
                }
            }
        }

        splittedPattern
            .forEach((str, indx) => {
                this.specials = this.specials.concat(indx === 0 ? str : str.split(''));
            });

        this.specials = this.specials.filter((sym, indx, arr) => sym && arr.indexOf(sym) === indx);

        this.events = {
            'click': this.onClick.bind(this),
            'keydown': this.onKeyDown.bind(this),
            'paste': this.onPaste.bind(this),
            'input': this.onInput.bind(this)
        };

        this.element.addEventListener('click', this.events['click']);
        this.element.addEventListener('input', this.events['input']);
        this.element.addEventListener('keydown', this.events['keydown']);
        this.element.addEventListener('paste', this.events['paste']);
        this.element.value = this.passStr('');
    }
}

window.NicePhone = NicePhone;