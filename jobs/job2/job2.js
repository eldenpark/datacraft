const split = require('../../src/utils/stringUtils').split;
const getDistancesBetweenSameElems = require('../../src/utils/arrayUtils').getDistancesBetweenSameElems;
const hasCommonElem = require('../../src/utils/arrayUtils').hasCommonElem;
const writeWithPrevLines = require('../../src/utils/writeUtils').writeWithPrevLines;

const jobConfig = {
}

const task1 = {};
task1.name = 'task1';
task1.config = {
  stream: 'DR'
};

task1.body = function(rl, store, done) {
  let prevLines = [];
  let prevLinesSplit = [];

  rl.on('line', (line) => {
    if (prevLines.length > 10) {
      prevLines.shift();
      prevLinesSplit.shift();
    }

    line = line.trim();
    lineSplit = split(line);
    for (var i = 0; i < prevLinesSplit.length; i++) {
      let dist0 = getDistancesBetweenSameElems(prevLinesSplit[i]);
      let dist1 = getDistancesBetweenSameElems(lineSplit);
      if (hasCommonElem(dist0, dist1)) {
        writeWithPrevLines(rl.output, prevLines, line, i);
        break;
      }
    }
    prevLinesSplit.push(lineSplit);
    prevLines.push(line);
  });

  rl.on('close', () => {
    rl.input.destroy();
    // store.out.tokens = store.out.tokens || [];
    // store.out.tokens = store.out.tokens.concat(names);
    done(store);
  });
}

exports.default = {
  jobConfig,
  tasks: [ task1 ]
};

