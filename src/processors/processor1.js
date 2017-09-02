const fs = require('fs');
const path = require('path');
const winston = require('winston');

const minify = require('../utils/stringUtils').minify;

/**
 * ...
 */
const doProcess = (paths, i, ws, done) => {
  if (i > paths.length - 1) {
    winston.info(`Finished processing with ${__filename}`);
    return done();
  }
  winston.debug(`Processing file: ${paths[i]}`);

  const file = fs.readFileSync(paths[i]).toString();
  ws.write(minify(file) + '\n');

  doProcess(paths, i + 1, ws, done);
};

exports.default = doProcess;