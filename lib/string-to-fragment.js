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
