(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var stringToFragment = require('./lib/string-to-fragment');
var randomizer = require('./lib/randomizer');
var insertCss = require('insert-css');


var html = "<a id=\"emoji_toggle\" title=\"Replace Emoji\" class=\"flexpane_toggle_button\"><i class=\"ts_icon ts_icon_emoji\"></i></a>\n";
var css = "#header_search_form {\n  width: 270px;\n  right: 45px;\n}\n\n#client-ui.flex_pane_showing:not(.details_showing) #header_search_form {\n  width: 347px;\n}\n\n#emoji_toggle {\n  position: absolute;\n  top: 9pt;\n  right: 125px;\n}\n\n#emoji_toggle:hover {\n  color: #08dd19;\n}\n\n#emoji_toggle.enabled,\n#emoji_toggle.enabled:hover {\n  color: #67686e !important;\n  background-color: #f7f7f7 !important;\n  border-color: rgba(0,0,0,.12) !important;\n  box-shadow: inset 0 1px 2px 0 rgba(0,0,0,.075) !important;\n}\n\n\n.ts_icon_emoji {\n  top: 4px !important;\n}\n\n.ts_icon_emoji:before {\n  content: '\\E137';\n}\n";

insertCss(css);

var icon = document.getElementById('recent_mentions_toggle');
var emojiNode = stringToFragment(html).firstChild;
icon.parentNode.insertBefore(emojiNode, icon);

toggleRandomizer();
emojiNode.classList.add('enabled');

emojiNode.addEventListener('click', function clickHandler(e) {
  var isActive = this.classList.contains('enabled');
  this.classList.toggle('enabled', !isActive);
  toggleRandomizer(isActive);
  e.preventDefault();
}, false);

function toggleRandomizer(disable) {
    TS.shared.onSendMsg = disable === true ?
                          TS.shared.onSendMsg.__restore() :
                          randomizer(TS.shared.onSendMsg);
}

},{"./lib/randomizer":2,"./lib/string-to-fragment":3,"insert-css":4}],2:[function(require,module,exports){
var emojis = Object.keys(TS.model.emoji_names_to_canonical_names);
var colonsRx = TS.emoji.getColonsRx();

function getRandomEmoji() {
  var randomIdx = Math.floor(Math.random() * emojis.length);
  return ':' + emojis[randomIdx] + ':';
}

function replaceTextRandom(msg) {
  msg = TS.emoji.replaceEmoticons(msg);
  return msg.replace(colonsRx, function (colonEmoji) {
    var replacement = TS.emoji.nameToCanonicalName(colonEmoji);
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