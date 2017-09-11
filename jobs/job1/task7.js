const { getRandomIntInclusive, getRandomInt } = require('../../src/utils/mathUtils');
const { SEPARATOR } = require('../../src/constants');
const { concat } = require('../../src/utils/stringUtils');
const LINE_NUMBERS = require('./jobConfig').default.LINE_NUMBERS;

const task7 = {};
task7.name = 'task7'
task7.config = {
  stream: 'RW'
}

/**
  in a string

  e.g.
  var common = require('ripple/platform/tizen/2.0/syncml-js-lib/common'),
  constant = require('ripple/platform/tizen/2.0/syncml-js-lib/constant'),
 */
task7.body = function (rl, store, done) {
  const out = rl.output;
  const numTokens = store.tokens.length;
  const numLines = store.lines.length;

  let text = undefined;
  let randomIdx = undefined;
  let randomToken1 = undefined;
  let randomToken2 = undefined;
  let randomToken3 = undefined;
  let randomToken4 = undefined;
  let randomLine = undefined;
  let truth = undefined;
  let queryLine = undefined;

  for(let l = 0; l < LINE_NUMBERS; l++) {
    text = '';
    randomIdx = getRandomIntInclusive(0, 9);
    randomToken1 = store.tokens[getRandomInt(0, numTokens)];
    randomToken2 = store.tokens[getRandomInt(0, numTokens)];
    randomToken3 = store.tokens[getRandomInt(0, numTokens)];
    randomToken4 = store.tokens[getRandomInt(0, numTokens)];

    for (let i = 0; i < 10; i++) {
      randomLine = store.lines[getRandomInt(0, numLines)];
      if (i === randomIdx) {
        truth = `var ${randomToken1} = ${randomToken2}('${randomToken3}/${randomToken4}/${randomToken1}');`;
        text = (i === 0) ? truth : concat(text, SEPARATOR, truth);
      } else {
        text = (i === 0) ? randomLine : concat(text, SEPARATOR, randomLine);
      }
    }
  
    randomToken1 = store.tokens[getRandomInt(0, numTokens)];
    queryLine = `var ${randomToken1} = ${randomToken2}('${randomToken3}/${randomToken4}/${randomToken1}');`;
    
    text = concat(text, SEPARATOR, queryLine);
    text = concat(text, SEPARATOR, randomIdx);
    out.write(`${text}\n`);
  }
  done(store);
};

exports.default = task7;