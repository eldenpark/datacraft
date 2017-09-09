const task1 = require('./task1').default;
const task2 = require('./task2').default;
const task3 = require('./task3').default;

const jobConfig = {
}

exports.default = {
  jobConfig,
  tasks: [ task1, task2, task3 ]
};

