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
