# nice_phone

- Lightweight
- Easy API
- Support copy/paste, delete, backspace
- Support all symbols in patterns :
    - +7 (nnn) nnn-nn-nn works for +7 (900) 123-45-67
    - 8 nnn nnnn-nnn for 8 900 1234-123
- Vanilla JS
- No cursor problems

### bower install nice_phone

Example of using:

```javascript

var nicePhone = new NicePhone({
    element : document.getElementById('testInput'), // input dom element
    pattern : '+7 (nnn) nnn-nn-nn', // pattern, n - is number, other - special symbols. Special symbols added automatically
    emptyChar : '●', // Char for non filled number
});
