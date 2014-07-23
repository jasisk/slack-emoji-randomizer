(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var stringToFragment = require('./lib/string-to-fragment');
var randomizer = require('./lib/randomizer');
var insertCss = require('insert-css');


var html = "<a id=\"emoji_replacer\" title=\"Replace Emoji\" class=\"normal\"><i></i></a>\n";
var css = "#header_search_form {\n  padding-right: 157px !important;\n}\n\n#emoji_replacer {\n  right: 115px;\n  position: absolute;\n  top: 12px;\n  height: 30px;\n  border: 1px solid #EEE;\n  border-radius: .25rem;\n  -webkit-user-select: none;\n  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);\n  padding: 4px 7px 2px;\n}\n\n#emoji_replacer:hover {\n  background: #f1f7fa;\n  border: 1px solid #ccc;\n}\n\n#emoji_replacer i {\n  line-height: 16px;\n}\n\n#emoji_replacer i:before {\n  content: '\\1f603';\n  display: inline-block;\n  font-size: .8rem;\n  text-align: center;\n  -webkit-user-select: none;\n  font-style: normal;\n}\n\n#emoji_replacer:hover i:before {\n  content: '\\1f606';\n}\n\n#emoji_replacer.disabled i:before {\n  content: '\\1f629';\n}\n\n#emoji_replacer.disabled:hover i:before {\n  content: '\\1f62b';\n}\n";

insertCss(css);

var icon = document.getElementById('help_icon');
var emojiNode = stringToFragment(html).firstChild;
icon.parentNode.insertBefore(emojiNode, icon);

toggleRandomizer(true);

emojiNode.addEventListener('click', function clickHandler(e) {
  var isDisabled = this.classList.contains('disabled');
  this.classList.toggle('disabled', !isDisabled);
  toggleRandomizer(isDisabled);
  e.preventDefault();
}, false);

function toggleRandomizer(enable) {
  if (enable !== false) {
    TS.shared.onSendMsg = randomizer(TS.shared.onSendMsg);
  } else {
    TS.shared.onSendMsg = TS.shared.onSendMsg.__restore();
  }
}

},{"./lib/randomizer":2,"./lib/string-to-fragment":3,"insert-css":4}],2:[function(require,module,exports){
var emojis = Object.keys(emoji.map.colons);

function getRandomEmoji() {
  var randomIdx = Math.floor(Math.random() * emojis.length);
  return ':' + emojis[randomIdx] + ':';
}

function replaceTextRandom(msg) {
  emoji.init_colons();
  msg = emoji.replace_emoticons_with_colons(msg);
  return msg.replace(emoji.rx_colons, function (colonEmoji) {
    var emojiKey = colonEmoji.substr(1, colonEmoji.length-2);
    var replacement = emoji.map.colons[emojiKey];
    return replacement ? getRandomEmoji() : colonEmoji;
  });
}

module.exports = function (onSendMsg) {
  var newMethod = function (ok, msg, model, models) {
    if (ok) {
      setTimeout(function () {
        var cleanText = TS.format.unFormatMsg(msg.text);
        var newText = replaceTextRandom(cleanText);
        if (newText !== cleanText) {
          TS.msg_edit.commitEdit(msg, model, newText);
        }
      }, 5000);
    }
    return onSendMsg.apply(this, arguments);
  };
  newMethod.__restore = function () {
    return onSendMsg;
  };
  return newMethod;
};

},{}],3:[function(require,module,exports){
module.exports = function stringToFragment(html) {
  var fragment = document.createDocumentFragment();
  var div = document.createElement('div');
  fragment.appendChild(div);
  div.innerHTML = html;
  var content = div.firstChild;
  fragment.appendChild(content);
  fragment.removeChild(div);
  return fragment;
};

},{}],4:[function(require,module,exports){
var inserted = {};

module.exports = function (css, options) {
    if (inserted[css]) return;
    inserted[css] = true;
    
    var elem = document.createElement('style');
    elem.setAttribute('type', 'text/css');

    if ('textContent' in elem) {
      elem.textContent = css;
    } else {
      elem.styleSheet.cssText = css;
    }
    
    var head = document.getElementsByTagName('head')[0];
    if (options && options.prepend) {
        head.insertBefore(elem, head.childNodes[0]);
    } else {
        head.appendChild(elem);
    }
};

},{}]},{},[1])