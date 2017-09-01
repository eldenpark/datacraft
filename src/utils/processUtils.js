const fs = require('fs');
const path = require('path');
const winston = require('winston');

const getAllPaths = require('./pathUtils').walk;
const extractFileName = require('./fileNameUtils').extractFileName;

/**
 * Very dangerous usage. State is outside of function.
 * This may be modified in the future.
 */
const _processState = {
  init: false,
  dataPaths: undefined,
  processorPaths: undefined,
  processorIdx: undefined,
  resultPath: undefined,
  processorName: undefined
};

const _initProcessorState = (dataPaths, processorPaths, resultPath, processorName) => {
  _processState.init = true;
  _processState.dataPaths = dataPaths;
  _processState.processorPaths = processorPaths;
  _processState.processorIdx = 0;
  _processState.resultPath = resultPath;
  _processState.processorName = processorName;
};

const _nextProcessor = () => {
  ++_processState.processorIdx;
  _process(
    _processState.processorIdx, 
    _nextProcessor);
};

const _shouldProcessorBeIgnored = (processorName) => {
  if (!processorName.length
    || (_processState.processorName != undefined && _processState.processorName != processorName)) {
    winston.info('Processor is ignored: %s', processorName)
    return true;
  } else {
    return false;
  }
}

const _process = (processorIdx, nextProcessor) => {
  winston.debug(33, _processState.processorIdx)
  if (!_processState.processorPaths.length) {
    winston.info(`No processors to be used. Process terminated.`)
    return;
  }
  if (_processState.processorPaths.length == processorIdx) {
    winston.info('Finished processing by all processors');
    return;
  }

  const processorPath = _processState.processorPaths[processorIdx];
  const processorName = extractFileName(processorPath);

  if (_shouldProcessorBeIgnored(processorName)) {
    _nextProcessor();
  } else {
    const resultPath = path.resolve(_processState.resultPath, `${processorName}.result`);
    winston.info(`Start processing with ${processorName} \nResult: ${resultPath}`);
    const ws = fs.createWriteStream(
      path.resolve(_processState.resultPath, `${processorName}.result`),
      {
        flags: 'w',
        defaultEncoding: 'utf8'
      });
  
    const processorModule = require(processorPath).default;
    processorModule(_processState.dataPaths, 0, ws, nextProcessor);
  }
};

const startProcess = (dataPaths, processorPaths, resultPath, processorName) => {
  if (!dataPaths.length) {
    winston.info(`No file to process. Process ended`);
  } else {
    _initProcessorState(dataPaths, processorPaths, resultPath, processorName);
    _process(0, _nextProcessor);
  }
};

exports.default = startProcess;