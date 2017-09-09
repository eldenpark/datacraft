const jsTokens = require('js-tokens').default;

const { regex, name } = require('../../src/utils/tokenizeUtils');
const task2 = require('./task2').default;
const task3 = require('./task3').default;

const jobConfig = {
}

const task1 = {};
task1.name = 'task1';
task1.config = {
  stream: 'DR'
};

task1.body = function(rl, store, done) {
  store.tokens = store.tokens || [];
  store.lines = store.lines || [];

  let names = [];
  let lines = [];

  rl.on('line', (line) => {
    line = line.trim();
    lines.push(line);
    
    var tokens = line.match(jsTokens);

    tokens.map((elem) => {
      if (name(elem)) {
        names.push(elem);
      }
    });
  });

  rl.on('close', () => {
    rl.input.destroy();
    store.tokens = store.tokens.concat(names);
    store.lines = store.lines.concat(lines);
    done(store);
  });
}

exports.default = {
  jobConfig,
  tasks: [ task1, task2, task3 ]
};

