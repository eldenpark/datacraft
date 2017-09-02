const fs = require('fs');
const path = require('path');
const winston = require('winston');

const getAllPaths = require('./utils/pathUtils').walkPromise;
const startProcess = require('./utils/processUtils').default;

const PROCESSOR_PATH = path.resolve(__dirname, 'processors');
const RESULT_PATH = path.resolve(__dirname, '..', 'result');
const DATA_PATH = path.resolve(__dirname, '..', 'data');

/**
 * Logging configuration
 */
winston.level = process.env.NODE_ENV === 'development' ? 'debug' : 'info';
winston.info("Debug level: %s", winston.level);

/**
 * ...
 */
const processorName = process.argv[2];
winston.info('Processor specified:', processorName)


/**
 * Entry point of the application.
 */
Promise.all([getAllPaths(DATA_PATH), getAllPaths(PROCESSOR_PATH)])
  .then(res => {
    winston.info('Number of files to process: %s', res[0].length);
    startProcess(res[0], res[1], RESULT_PATH, processorName);
  })
  .catch(err => {
    winston.erro(err);
  })
