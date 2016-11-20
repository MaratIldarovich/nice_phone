"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,t){for(var s=0;s<t.length;s++){var n=t[s];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,s,n){return s&&e(t.prototype,s),n&&e(t,n),t}}();!function(){var e=/[^0-9]/g,t={Delete:[46],Backspace:[8],ArrowLeft:[37],ArrowRight:[39],F5:[116],number:[48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105]},s="n",n=Object.keys(t),a=function(){function a(e){var i=this;_classCallCheck(this,a),this.element=e.element,this.emptyChar=e.emptyChar||"",this.pattern=e.pattern,this.changeCallback=e.changeCallback||null,this.specials=[];var r=this,l=this.element,c=this.pattern.split(s);this.numOfNumbers=c.length-1,c.forEach(function(e,t){i.specials=i.specials.concat(0===t?e:e.split(""))}),this.specials=this.specials.filter(function(e,t,s){return e&&s.indexOf(e)===t}),l.addEventListener("click",function(e){r._isCorrectPos()||r.setPos(r._getMinPos())}),l.addEventListener("keydown",function(e){var s=e.key;s||!function(){var a=e.keyCode||e.which;n.every(function(e){return t[e].indexOf(a)===-1||(s=e,!1)})}();var a=1*s>=0||"number"===s;if(!e.ctrlKey&&n.indexOf(s)===-1&&!a&&!e.metaKey)return void e.preventDefault();switch(r.lastKey=s,s){case"Backspace":case"ArrowLeft":case"ArrowRight":r._isCorrectPos(s)||(e.preventDefault(),r.setPos(r._getMinPos()))}}),l.addEventListener("paste",function(e){var t=r.getPos(),s=e.clipboardData,n=s.getData("text");n=r.filterStr(n),n.length>r.numOfNumbers&&(n=n.slice(-r.numOfNumbers)),e.preventDefault();var a=this.value.substr(0,t)+n+this.value.substr(t+n.length),i=r.passStr(a),l=r._getNewPos(i,null,n,t);this.value=i,r.setPos(l,l)}),l.addEventListener("input",function(e){var t=r.passStr(this.value),s=r._getNewPos(t,r.lastKey,null,r.getPos());this.value=t,r.setPos(s,s),"function"==typeof r.changeCallback&&r.changeCallback()}),this.updateFromRaw("")}return _createClass(a,[{key:"filterStr",value:function(t){return 0===t.lastIndexOf(this.specials[0])&&(t=t.slice(this.specials[0].length)),t=t.replace(e,"")}},{key:"passStr",value:function(e){for(var t=this.filterStr(e),n="",a=0,i=0;(a<t.length||this.emptyChar)&&i<this.pattern.length;a++,i++){for(var r=t[a]||this.emptyChar;this.pattern[i]!==s;)n+=this.pattern[i],i++;n+=r}return n}},{key:"updateFromRaw",value:function(e){e=e||"",this.element.value=this.passStr(e)}},{key:"getPos",value:function(){return this.element.selectionStart}},{key:"setPos",value:function(e){this.element.selectionStart=e,this.element.selectionEnd=e}},{key:"setMinPos",value:function(){this.setPos(this._getMinPos())}},{key:"focus",value:function(){this.element.focus(),this.setMinPos()}},{key:"_getNewPos",value:function(e,t,s,n){var a,i;switch(t){case"Backspace":i=n+1,a=n;break;case"Delete":a=n,i=n;break;default:a=n,i=n-1,s&&(a+=s.length)}for(var r=i;r<a;r++)for(var l=0;l<this.specials.length;l++){var c=this.specials[l],u=e.substr(r,c.length)===c;u&&(a+=c.length)}return a}},{key:"_isCorrectPos",value:function(e,t){t=t||this.getPos();var s=void 0;switch(e){case"ArrowRight":s=1;break;default:s=-1}t+=s;for(var n=this.element.value[t];this.specials.indexOf(n)!==-1;)t+=s,n=this.element.value[t];return n!==this.emptyChar&&this.getPos()+s>=this.specials[0].length}},{key:"_getMinPos",value:function(){var e=this.element.value.indexOf(this.emptyChar);return e=Math.max(e,this.specials[0].length)}},{key:"isValid",value:function(){return this.element.value.replace(this.emptyChar,"").length===this.pattern.length}},{key:"value",get:function(){return this.element.value},set:function(e){this.updateFromRaw(e)}}]),a}();window.NicePhone=a}();