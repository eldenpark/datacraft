const fs = require('fs');
const path = require('path');

const getAllPaths = require('./utils/getAllPaths').default;
const removeExtension = require('./utils/removeExtension').default;

/**
 * Very dangerous usage. State is outside of function. 
 * This approache will be valid as long as it works well.
 */
const state = {
  init: false,
  processors: undefined,
  processorIdx: undefined,
  paths: undefined
};

const _initProcessorState = (processors, paths) => {
  state.processors = processors;
  state.processorIdx = 0;
  state.paths = paths;
  state.init = true;
};

const _nextProcessor = () => {
  ++state.processorIdx;
  _process(state.processors, state.processorIdx, state.paths, _nextProcessor);
};

const _process = (processors, idx, paths, nextProcessor) => {
  if (processors.length == idx) {
    console.log('Finished processing by all processors');
    return;
  }

  const processor = processors[idx];
  const processorName = removeExtension(processor);
  if (!processorName.length) _process(processors, idx + 1);
  
  console.log(`Start processing with ${processorName}`);

  const ws = fs.createWriteStream(
    path.resolve(__dirname, '..', 'result', `${processorName}.result`), 
    {
      flags: 'w', 
      defaultEncoding: 'utf8' 
    });

  const processorModule = require(path.resolve(__dirname, 'processors', processor)).default;
  processorModule(paths, 0, ws, nextProcessor);
}

const processAllFiles = (paths) => {
  if (!paths.length) {
    console.log(`No file to process. Process ended`);
  } else {
    // Iterate over processors.
    fs.readdir(path.resolve(__dirname, 'processors'), (err, processors) => {
      _initProcessorState(processors, paths);
      _process(processors, 0, paths, _nextProcessor)
    });
  }
};

/**
 * Entry point of the application.
 */
getAllPaths("./data", function(err, paths) {
  if (err) throw err;
  console.log(`Number of files to process: ${paths.length}`)
  processAllFiles(paths);
});