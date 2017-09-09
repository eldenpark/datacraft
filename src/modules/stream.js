const winston = require('winston');
const fs = require('fs');
const readline = require('readline');
const path = require('path');
const R = require('ramda');

const { createReadline, createWriteStream, createReadStream } = require('../utils/streamUtils');

exports.default = function(module) {
  module.prototype.stream = function() {
    return {
      dataReadChain: _dataReadChain.bind(this),
      readWrite: _readWrite.bind(this)
    };
  };

  /**
   * ...
   * @param {*} task 
   * @param {*} store 
   */
  const _dataReadChain = function(task, store) {
    const taskName = task.name;
    const taskBody = task.body;
    winston.info(`Data read stream is initiated for ${taskName}`);
    
    const { dataPaths } = this.config;
    if (dataPaths.length) {
      this.state.dataIdx = 0;
    }

    const readStream = createReadStream(dataPaths[this.state.dataIdx]);
    const writeStream = createWriteStream(this.config.jobName, taskName, this.config.resultPath);
    var rl = createReadline(readStream, writeStream);

    this.state.taskBody = taskBody;
    this.state.writeStream = writeStream;
    return new Promise((resolve, reject) => {
      _executeDataReadTaskSingle.call(this, rl, store, resolve);
    });
  };

  /**
   * ...
   * @param {*} task 
   * @param {*} store 
   */
  const _readWrite = function(task, store) {
    const taskName = task.name;
    const taskBody = task.body;

    const readStream = createReadStream(null, this.config.dataPaths);
    const writeStream = createWriteStream(this.config.jobName, taskName, this.config.resultPath);
    const rl = createReadline(readStream, writeStream);

    this.state.taskBody = taskBody;
    return new Promise((resolve, reject) => {
      _executeReadWriteTaskSingle.call(this, rl, store, resolve);
    });
  };

  /**
   * ...
   * @param {*} rl
   * @param {*} out 
   * @param {*} resolve 
   */
  const _executeDataReadTaskSingle = function(rl, store, resolve) {
    const { taskBody } = this.state;
    taskBody(rl, store, _doneDataReadTaskSingle.bind(this, resolve));
  };

  /**
   * ...
   * @param {*} resolve 
   * @param {*} store 
   */
  const _doneDataReadTaskSingle = function(resolve, store) {
    winston.debug(`Finished reading: ${this.config.dataPaths[this.state.dataIdx]}`);

    if (++this.state.dataIdx >= this.config.dataPaths.length) {
      winston.info(`Finishing [ dataReadStream ] for ${this.state.taskName}`);
      // winston.debug(`Result: ${store.out}`);
      resolve(store);
      return "Done data read task";
    }

    const readStream = createReadStream(this.config.dataPaths[this.state.dataIdx]);
    const writeStream = this.state.writeStream;
    var rl = createReadline(readStream, writeStream);
    _executeDataReadTaskSingle.call(this, rl, store, resolve);
  };

  /**
   * ...
   * @param {*} rl 
   * @param {*} store 
   * @param {*} resolve 
   */
  const _executeReadWriteTaskSingle = function(rl, store, resolve) {
    const { taskBody } = this.state;
    taskBody(rl, store, _doneReadWriteTaskSingle.bind(this, resolve));
  };

  const _doneReadWriteTaskSingle = function(resolve, store) {
    winston.info(`Finishing [ readWriteStream ] for ${this.state.taskName}`);
    resolve(store);
  };
  
};