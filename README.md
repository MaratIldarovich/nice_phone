bower install nice_phone

Example of using:

```javascript

var nicePhone = new window.NicePhone({
    element : document.getElementById('testInput'), // input id
    pattern : '+7 (nnn) nnn-nn-nn', //n - any number, other symbols - is mask symbols
    emptyChar : '.', // symbols for non-filled number
    defaultRaw : '1234' // default value
});
