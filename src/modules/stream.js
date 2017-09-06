const winston = require('winston');
const fs = require('fs');
const readline = require('readline');
const path = require('path');
const R = require('ramda');

exports.default = function(module) {
  module.prototype.stream = function() {
    return {
      dataReadChain: _dataReadChain.bind(this)
    }
  };

  const _dataReadChain = function(taskName, taskBody) {
    winston.info(`Data read stream is initiated for ${taskName}`);
    
    const { dataPaths } = this.config;
    if (dataPaths.length) {
      this.state.dataIdx = 0;
    }

    var rl = readline.createInterface({
      input: fs.createReadStream(dataPaths[this.state.dataIdx])
    });

    this.state.taskBody = taskBody;
    return new Promise((resolve, reject) => {
      _executeReadTaskSingle.call(this, rl, [], resolve);
    });
  };

  const _executeReadTaskSingle = function(rl, out, resolve) {
    const { taskBody } = this.state;
    taskBody(rl, out, _doneDataReadTaskSingle.bind(this, resolve));
  };

  const _doneDataReadTaskSingle = function(resolve, out) {
    winston.debug(`Finished reading: ${this.config.dataPaths[this.state.dataIdx]}`)

    if (++this.state.dataIdx >= this.config.dataPaths.length) {
      winston.debug(`Result: ${out.length}`);
      resolve(out);
      return;
    }

    const readStream = fs.createReadStream(this.config.dataPaths[this.state.dataIdx]);
    var rl = readline.createInterface({
      input: readStream
    });
    _executeReadTaskSingle.call(this, rl, out, resolve);
  };



  // const _dataReadStreamChain = function() {
    
  // };

  // const _readWriteStream = function(dataIdx) {
  //   console.log(1, this)

  //   const resultDirectory = path.resolve(this.config.resultPath, this.config.jobName);
  //   if (!fs.existsSync(resultDirectory)) {
  //     fs.mkdirSync(resultDirectory);
  //   }
  //   const resultPath = path.resolve(resultDirectory, `${taskName}-${new Date().getTime()}.result`);

  //   winston.info(`Start processing with ${taskName}`);
  //   winston.info(`Result path: ${resultPath}`);

  //   const ws = fs.createWriteStream(
  //     resultPath,
  //     {
  //       flags: 'w',
  //       defaultEncoding: 'utf8'
  //     });
  // };

  // const _doneProcessingSingleFile = function() {

  // };
};