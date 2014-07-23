var stringToFragment = require('./lib/string-to-fragment');
var randomizer = require('./lib/randomizer');
var insertCss = require('insert-css');
var fs = require('fs');

var html = fs.readFileSync('./assets/inject.html', 'utf8');
var css = fs.readFileSync('./assets/inject.css', 'utf8');

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
    TS.shared.onSendMsg = enable !== false ?
                          randomizer(TS.shared.onSendMsg) :
                          TS.shared.onSendMsg.__restore();
}
