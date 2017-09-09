const { getRandomIntInclusive, getRandomInt } = require('../../src/utils/mathUtils');
const { SEPARATOR } = require('../../src/constants');
const { concat } = require('../../src/utils/stringUtils');
const { LINE_NUMBERS } = require('./meta');

const task8 = {};
task8.name = 'task8'
task8.config = {
  stream: 'RW'
}

/**
  Proper function argument (고유함수)

  e.g.
  acceleration: new Acceleration(e.x, e.y, e.z),
  accelerationIncludingGravity: new Acceleration(e.x, e.y, e.z),
 */
task8.body = function (rl, store, done) {
  const out = rl.output;
  const numTokens = store.tokens.length;
  const numLines = store.lines.length;

  let text = undefined;
  let randomIdx = undefined;
  let randomToken1 = undefined;
  let randomToken2 = undefined;
  let randomToken3 = undefined;
  let randomToken4 = undefined;
  let randomToken5 = undefined;
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
    randomToken5 = store.tokens[getRandomInt(0, numTokens)];

    for (let i = 0; i < 10; i++) {
      randomLine = store.lines[getRandomInt(0, numLines)];
      if (i === randomIdx) {
        truth = `${randomToken1}: new ${randomToken2}(${randomToken3}, ${randomToken4}, ${randomToken5});`;
        text = (i === 0) ? truth : concat(text, SEPARATOR, truth);
      } else {
        text = (i === 0) ? randomLine : concat(text, SEPARATOR, randomLine);
      }
    }
  
    randomToken1 = store.tokens[getRandomInt(0, numTokens)];
    queryLine = `${randomToken1}: new ${randomToken2}(${randomToken3}, ${randomToken4}, ${randomToken5});`;
    
    text = concat(text, SEPARATOR, queryLine);
    text = concat(text, SEPARATOR, randomIdx);
    out.write(`${text}\n`);
  }
  done(store);
};

exports.default = task8;