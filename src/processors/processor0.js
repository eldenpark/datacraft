const fs = require('fs');
const path = require('path');
const winston = require('winston');

const split = require('../utils/stringUtils').split;
const getDistancesBetweenSameElems = require('../utils/arrayUtils').getDistancesBetweenSameElems;
const hasCommonElem = require('../utils/arrayUtils').hasCommonElem;
const writeWithPrevLines = require('../utils/writeStreamUtils').writeWithPrevLines;

/**
 * Picks a sentence where the distance between the two same words is same 
 * with that of any of previous sentences.
 * 
 * Done to each file of data
 */
const doProcess = (paths, i, ws, done) => {
  if (i > paths.length - 1) {
    winston.info(`Finished processing with ${__filename}`);
    return done();
  }
  // console.log(`Processing file: ${paths[i]}`);

  let prevLines = [];
  let prevLinesSplit = [];

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

  rl.on('close', function() {
    rl.input.destroy();
    // Process files in pseudo-synchronous manner
    doProcess(paths, i + 1, ws, done);
  });
};

exports.default = doProcess;