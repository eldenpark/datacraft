const fs = require('fs');
const path = require('path');

const minify = require('../utils/stringUtils').minify;

/**
 * ...
 */
const process = (paths, i, ws, done) => {
  if (i > paths.length - 1) {
    console.log(`Finished processing with ${__filename}`);
    return done();
  }
  console.log(`Processing file: ${paths[i]}`);

  const file = fs.readFileSync(paths[i]).toString();
  ws.write(minify(file) + '\n');

  process(paths, i + 1, ws, done);
};

exports.default = process;