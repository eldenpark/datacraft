const winston = require('winston');
const path = require('path');
const fs = require('fs');
const R = require('ramda');

exports.default = function(module) {
  module.prototype.run = function() {
    this.configure()
      .then(_init.bind(this))
      .then(_runTaskQueue.bind(this))
      .catch(err => winston.error("Error in jobLauncher", err));
  };

  const _init = function(res) {
    const { dataPaths, jobPath, resultPath, jobName } = this.config;
    const job = _resolveJobPath(jobPath, jobName);
    const jobModule = require(job).default;
    this.state.tasks = jobModule.tasks;

    return Promise.resolve({
      jobConfig: jobModule.jobConfig, 
      tasks: jobModule.tasks
    });
  }

  const _runTaskQueue = function(res) {
    _runSingleTask.call(this, 0, {});
    // _runFirstTask.call(this, res.tasks[0])
    //   .then(_runNextTask.bind(this, res.task[1]))
  };

  // const _runFirstTask = function(task) {
  //   if (R.path(['config', 'stream'], task) === 'DR') {
  //     return this.stream().dataReadChain(task.name, task.body);
  //   }
  // };

  const _runSingleTask = function(taskIdx, input) {
    if (taskIdx >= this.state.tasks.length) {
      winston.info(`All over`);
      return;
    }
    const task = this.state.tasks[taskIdx];
    const streamType = _getStreamType(task);
    console.log(task)
    winston.debug(`Run single task at ${taskIdx}: ${task.name}, ${streamType}`);
    
    this.stream()
      [streamType](task.name, task.body)
      .then(res => {
        _runSingleTask.call(this, taskIdx + 1, res);
      })
      .catch(err => {
        winston.error(`run single task error`, err)
      })
  }

  const _getStreamType = function(task) {
    const stream = R.path(['config', 'stream'], task);
    switch(stream) {
      case 'DR':
        return 'dataReadChain';
      default:
        return 'dataReadChain';
    }
  };

  const _runNextTask = function(task, input) {
    
  }

  const _resolveJobPath = function(jobPath, jobName) {
    const job = path.resolve(jobPath, jobName, `${jobName}.js`);
    if (!fs.existsSync(job)) {
      throw new Error("Job file not found");
    }
    return job;
  };
};