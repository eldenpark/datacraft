const fs = require('fs');
const path = require('path');

const getAllPaths = require('../utils/getAllPaths').default;
const split = require('../utils/split').default;
const getDistancesBetweenSameWords = require('../utils/getDistancesBetweenSameWords').default;
const hasCommonElem = require('../utils/hasCommonElem').default;
const writeWithPrevLines = require('../utils/writeWithPrevLines').default;

/**
 * Picks a sentence where the distance between the two same words is same 
 * with that of any of previous sentences.
 * 
 * Done to each file of data
 */
const process = (paths, i, ws, nextProcessor) => {
  if (i > paths.length - 1) {
    console.log(`Finished processing with ${__filename}`);
    nextProcessor();
    return 3;
  }
  let res = [];
  let prevLines = [];
  let prevLinesSplit = [];

  console.log(`Processing file: ${paths[i]}`);

  var rl = require('readline').createInterface({
      input: fs.createReadStream(paths[i]),
      output: ws
    });

  rl.on('line', function (line) {
    if (prevLines.length > 10) {
      prevLines.shift();
      prevLinesSplit.shift();
    }

    line = line.trim();
    lineSplit = split(line);
    for (var i = 0; i < prevLinesSplit.length; i++) {
      let dist0 = getDistancesBetweenSameWords(prevLinesSplit[i]);
      let dist1 = getDistancesBetweenSameWords(lineSplit);
      if (hasCommonElem(dist0, dist1)) {
        writeWithPrevLines(rl.output, prevLines, line, i);
      }
    }
    prevLinesSplit.push(lineSplit);
    prevLines.push(line);
  });

  rl.on('close', function() {
    rl.input.destroy();
    // Process files in pseudo-synchronous manner
    process(paths, i + 1, ws, nextProcessor);
  });
};

exports.default = process;