const fs = require('fs');
const path = require('path');

const EXCLUDED_FILE_NAME = require('../constants/ExcludedFileName').default;

/**
 * Currently not in use.
 */
const _getFileName = (path) => {
  let arr = path.split('/');
  return arr[arr.length - 1];
}

const walk = function(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) {
      return done(null, results);
    }
    
    list.forEach(function(file) {
      const filePath = path.resolve(dir, file);
      // console.log(`filePath ${filePath}`);
      fs.stat(filePath, function(err, stat) {
        // console.log(`EXAM ${filePath}`);
        if (stat && stat.isDirectory()) {
          // console.log(`DIRECTORY ${filePath}`);
          walk(filePath, function(err, res) {
            results = results.concat(res);
            if (!--pending) {
              done(null, results);
            }
          });
        } else {
          if(!EXCLUDED_FILE_NAME.includes(file)) {
            // console.log(`ADD FILE, ${filePath}`)
            results = results.concat(filePath);
          }
          if (!--pending) {
            done(null, results);
          }
        }
      });
    });
  });
};

exports.default = walk;