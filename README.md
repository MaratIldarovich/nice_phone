# nice_phone

- Lightweight
- Support copy/paste, delete, backspace
- Support all symbols in patterns :
    - +7 (nnn) nnn-nn-nn works for +7 (900) 123-45-67
    - 8 nnn nnnn-nnn for 8 900 1234-123
- Vanilla JS
- No cursor problems

bower install nice_phone

Example of using:

```javascript

var nicePhone = new window.NicePhone({
    element : document.getElementById('testInput'), // input id
    pattern : '+7 (nnn) nnn-nn-nn', //n - any number, other symbols - is mask symbols
    emptyChar : '.', // symbols for non-filled number
    defaultRaw : '1234' // default value
});
