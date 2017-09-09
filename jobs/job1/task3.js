const task3 = {};
task3.name = 'task3'
task3.config = {
  stream: 'RW'
}
task3.body = function (rl, store, done) {
  // console.log(store.tokens.length);
  // console.log(store.lines.length);
}

exports.default = task3;