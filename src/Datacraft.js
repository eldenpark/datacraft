const path = require('path');
const winston = require('winston');

const paths = require('./modules/paths').default;
const getAllPaths = require('./utils/pathUtils').walkPromise;
const startProcess = require('./utils/processUtils').default;
const inherit = require('./utils/extendUtils').inherit;
const configure = require('./modules/configure').default;
const jobLauncher = require('./modules/jobLauncher').default;
const stream = require('./modules/stream').default;

/**
 * Configures logging level.
 */
winston.level = process.env.NODE_ENV === 'development' ? 'debug' : 'info';
winston.info("Debug level: %s", winston.level);

const jobName = process.argv[2];
winston.info('Job specified:', jobName)

const Datacraft = function(config) {
  this.config = config;
  this.state = {
    tasks: [],
    dataIdx: undefined,
    
  };
};

inherit(Datacraft, configure);
inherit(Datacraft, paths);
inherit(Datacraft, jobLauncher);
inherit(Datacraft, stream);

exports.default = Datacraft;