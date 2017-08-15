const fs = require('fs');
const path = require('path');

const getAllPaths = require('./utils/pathUtils').walkPromise;
const process = require('./utils/processUtils').default;

const PROCESSOR_PATH = path.resolve(__dirname, 'processors');
const RESULT_PATH = path.resolve(__dirname, '..', 'result');
const DATA_PATH = path.resolve(__dirname, '..', 'data');

/**
 * Entry point of the application.
 */
Promise.all([getAllPaths(DATA_PATH), getAllPaths(PROCESSOR_PATH)])
  .then(res => {
    process(res[0], res[1], RESULT_PATH);
  })
  .catch(err => {
    console.log(err);
  })
