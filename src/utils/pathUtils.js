const fs = require('fs');
const path = require('path');

const EXCLUDED_FILE_NAME = require('../constants/ExcludedFileName').default;

/**
 * Gets all paths recursively
 */
const walk = function(dir, done) {
  // console.log(`WALK`);
  let results = [];
  fs.readdir(dir, function(err, paths) {
    if (err) return done(err);
    var pending = paths.length;
    if (!pending) {
      return done(null, results);
    }
    
    paths.forEach(function(file) {
      const filePath = path.resolve(dir, file);
      // console.log(`filePath ${filePath}`);
      fs.stat(filePath, function(err, stat) {
        // console.log(`EXAM ${filePath}`);
        if (stat && stat.isDirectory()) {
          // console.log(`DIRECTORY ${filePath}`);
          walk(filePath, function(err, res) {
            // console.log(`2 ADD FILE ${res} TO ${results}`)
            results = results.concat(res);
            if (!--pending) {
              // console.log(`DONE 2 ${done}`);
              done(null, results);
            }
          });
        } else {
          if(!EXCLUDED_FILE_NAME.includes(file)) {
            // console.log(`3 ADD FILE ${filePath} TO ${results}`)
            results = results.concat(filePath);
          }
          if (!--pending) {
            // console.log(`DONE 3 ${done}`);
            done(null, results);
          }
        }
      });
    });
  });
};

/**
 * Promisified version of walk().
 */
const walkPromise = (dir) => {
  var pr = new Promise((resolve, reject) => {
    var result = [];
    fs.readdir(dir, (err, paths) => {
      if (err) reject(err);
      let pending = paths.length;

      paths.map((file) => {
        // console.log(file);
        const filePath = path. resolve(dir, file);
        fs.stat(filePath, (err, stat) => {
          if (stat && stat.isDirectory()) {
            // console.log('Directory');
            walkPromise(filePath).then(res => {
              result = result.concat(res);
              resolve(result);
            });
          } else {
            // console.log(`ADD ${filePath} TO ${result}`);
            if(!EXCLUDED_FILE_NAME.includes(file)) {
              result = result.concat(filePath);
            }
            if (!--pending) {
              // console.log(`ADD ${result}`);
              resolve(result);
            }
          }
        });
      });
    });
  });
  return pr;
};

module.exports = {
  walk,
  walkPromise
}