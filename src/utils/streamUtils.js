const path = require('path');
const fs = require('fs');
const winston = require('winston');
const readline = require('readline');
 
 /**
   * ...
   * @param {*} input 
   * @param {*} output 
   */
  exports.createReadline = function(input, output) {
    if (!input) throw new Error("ReadStream is not defined while creating interface");
    return readline.createInterface({
      input,
      output
    });
  };

  /**
   * ...
   * @param {*} path 
   */
  exports.createReadStream = function(path, dataPaths) {
    if (!path) {
      if (dataPaths === undefined) throw new Error("Failed to create read stream");
      path = dataPaths[0];
    }
    return fs.createReadStream(path);
  }

  /**
   * ...
   * @param {*} taskName 
   */
  exports.createWriteStream = function(jobName, taskName, resultPath) {
    const resultDirectory = path.resolve(resultPath, jobName);
    if (!fs.existsSync(resultDirectory)) {
      fs.mkdirSync(resultDirectory);
    }

    const detailedResultPath = 
      path.resolve(resultDirectory, `${taskName}-${new Date().getTime()}.result`);
    return fs.createWriteStream(detailedResultPath, {
      flags: 'w',
      defaultEncoding: 'utf8'
    });
  };