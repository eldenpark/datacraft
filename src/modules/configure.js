const winston = require('winston');
const fs = require('fs');
const path = require('path');

exports.default = function(module) {
  module.prototype.configure = function() {
    const { dataPath, jobPath } = this.config;
    const getAllPaths = module.prototype.getAllPaths;

    return new Promise((resolve, reject) => {
      Promise.all([getAllPaths(dataPath)])
        .then(res => {
          winston.info('Number of files to process: %s', res[0].length);
          this.config.dataPaths = res[0];
          resolve("Datacraft init succeed");
        })
        .catch(err => {
          reject("init error");
          winston.error(err);
        });
    });
  }
}