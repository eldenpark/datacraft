const fs = require('fs');
const path = require('path');
const getAllPaths = require('./utils/getAllPaths').default;
const split = require('./utils/split').default;
const getDistancesBetweenSameWords = require('./utils/getDistancesBetweenSameWords').default;
const hasCommonElem = require('./utils/hasCommonElem').default;
const writeWithPrevLines = require('./utils/writeWithPrevLines').default;

/**
 * Picks a sentence where the distance between the two same words
 * is same with that of any of previous sentences.
 */
const _processSingleFile = (files, i, ws, cb) => {
  let res = [];
  let prevLines = [];
  let prevLinesSplit = [];

  console.log(`Processing file: ${files[i]}`)

  var rl = require('readline').createInterface({
      input: fs.createReadStream(files[i]),
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
    _processNextFile(files, i + 1, ws);
  });
};

const _processNextFile = (files, i, ws) => {
  if (i < files.length) {
    _processSingleFile(files, i, ws, _processNextFile);
  } else {
    console.log(`Finished processing all files`);
  }
};

const processAllFiles = (files) => {
  const ws = fs.createWriteStream(
    path.resolve(__dirname, '..', 'result', 'res0'), 
    {
      flags: 'w', 
      defaultEncoding: 'utf8' 
    });

  if (!files.length) {
    console.log(`No file to process. Process ended`);
  } else {
    _processSingleFile(files, 0, ws, _processNextFile);
  }
};

getAllPaths("./data", function(err, results) {
  if (err) throw err;
  console.log(`Number of files to process: ${results.length}`)
  processAllFiles(results);
});