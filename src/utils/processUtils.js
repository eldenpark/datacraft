const fs = require('fs');
const path = require('path');

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
  resultPath: undefined
};

const _initProcessorState = (dataPaths, processorPaths, resultPath) => {
  _processState.init = true;
  _processState.dataPaths = dataPaths;
  _processState.processorPaths = processorPaths;
  _processState.processorIdx = 0;
  _processState.resultPath = resultPath;
};

const _nextProcessor = () => {
  ++_processState.processorIdx;
  _process(
    _processState.processorIdx, 
    _nextProcessor);
};

const _process = (processorIdx, nextProcessor) => {
  if (!_processState.processorPaths.length) {
    console.log(`No processors to be used. Process terminated.`)
    return;
  }
  if (_processState.processorPaths.length == processorIdx) {
    console.log('Finished processing by all processors');
    return;
  }

  const processorPath = _processState.processorPaths[processorIdx];
  const processorName = extractFileName(processorPath);
  if (!processorName.length) _process(processors, processorIdx + 1);

  const resultPath = path.resolve(_processState.resultPath, `${processorName}.result`);
  console.log(`Start processing with ${processorName} \nResult: ${resultPath}`);
  const ws = fs.createWriteStream(
    path.resolve(_processState.resultPath, `${processorName}.result`), 
    {
      flags: 'w', 
      defaultEncoding: 'utf8' 
    });

  const processorModule = require(processorPath).default;
  processorModule(_processState.dataPaths, 0, ws, nextProcessor);
};

const process = (dataPaths, processorPaths, resultPath) => {
  if (!dataPaths.length) {
    console.log(`No file to process. Process ended`);
  } else {
    _initProcessorState(dataPaths, processorPaths, resultPath);
    _process(0, _nextProcessor);
  }
};

exports.default = process;