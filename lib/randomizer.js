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
