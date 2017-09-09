const path = require('path');
const winston = require('winston');

const Datacraft = require('./Datacraft').default;
const JOB_PATH = path.resolve(__dirname, '..', 'jobs');
const RESULT_PATH = path.resolve(__dirname, '..', 'result');
const DATA_PATH = path.resolve(__dirname, '..', 'data');

const config = {
  dataPath: DATA_PATH,
  dataPaths: '',
  jobPath: JOB_PATH,
  job: '',
  jobName: process.argv[2],
  resultPath: RESULT_PATH,
};

const dataCraft = new Datacraft(config);
dataCraft.run();
