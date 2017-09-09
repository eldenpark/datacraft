const { getRandomIntInclusive, getRandomInt } = require('../../src/utils/mathUtils');
const { SEPARATOR } = require('../../src/constants');
const { concat } = require('../../src/utils/stringUtils');

/**
  object의 properties (object notation)
  e.g.
  method: method,
  url: url,
 */
const task2 = {};
task2.name = 'task2'
task2.config = {
  stream: 'RW'
}
task2.body = function (rl, store, done) {
  const out = rl.output;
  const numTokens = store.tokens.length;
  const numLines = store.lines.length;

  let text = '';
  let randomIdx = undefined;
  let randomToken = undefined;
  let randomLine = undefined;
  let truth = undefined;
  let queryLine = undefined;

  for(let l = 0; l < 2; l++) {
    randomIdx = getRandomIntInclusive(0, 9);
    for (let i = 0; i < 1000; i++) {
      randomToken = store.tokens[getRandomInt(0, numTokens)];
      randomLine = store.lines[getRandomInt(0, numLines)];
  
      if (i === randomIdx) {
        truth = `${randomToken}: ${randomToken}`;
        text = (i === 0) ? truth : concat(text, SEPARATOR, truth);
      } else {
        text = (i === 0) ? randomLine : concat(text, SEPARATOR, randomLine);
      }
    }
  
    randomToken = store.tokens[getRandomInt(0, numTokens)];
    queryLine = `${randomToken}: ${randomToken}`;
    text = concat(text, SEPARATOR, queryLine);
    text = concat(text, SEPARATOR, randomIdx);
    out.write(`${text}\n`);
  }
  done(store);
}

exports.default = task2;