var stringToFragment = require('./lib/string-to-fragment');
var randomizer = require('./lib/randomizer');
var insertCss = require('insert-css');
var fs = require('fs');

var html = fs.readFileSync('./assets/inject.html', 'utf8');
var css = fs.readFileSync('./assets/inject.css', 'utf8');

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
