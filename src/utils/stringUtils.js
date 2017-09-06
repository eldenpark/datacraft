/**
 * ...
 */
const split = (text) => {
  var res = []
  var word = ''
  for (var i = 0; i < text.length; i++) {
    if (text[i].match(/[^0-9a-zA-Z]/g)) {
      if (word.length) {
        res.push(word);
        word = '';
      }
      res.push(text[i])
    } else {
      word = word.concat(text[i])
    }
  }
  if (word.length) {
    res.push(word);
  }
  return res;
};

const REDUNDANT_WHITESPACE_REGEX = /(\s{2,})(?=(?:[^\'"]*[\'"][^\'"]*[\'"])*[^\'"]*$)/g;
const CONTROLLING_SYMBOL_REGEX = /(\\r\\n|\\n|\\t|\r\n|\n)+(?=(?:[^\'"]*[\'"][^\'"]*[\'"])*[^\'"]*$)/g;
const REDUNDANT_WHITESPACE_REGEX2 = /(\s{2,})/g;
const CONTROLLING_SYMBOL_REGEX2 = /(\\r\\n|\\n|\\t|\r\n|\n)+/g;

/**
 * ...
 */
const minify = (text) => {
  text = text.replace(CONTROLLING_SYMBOL_REGEX2, '');
  return text.replace(REDUNDANT_WHITESPACE_REGEX2, ' ');
}

module.exports = {
  split,
  minify
}