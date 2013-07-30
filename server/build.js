
/**
 * Module dependencies.
 */

var exec = require('child_process').exec;

/**
 * Build components.
 *
 * @api public
 */

module.exports = function(req, res, next){
  // you could use the js builder, but
  // this works just fine, though slower
  console.log('Building components');
  exec('make', function(err, stdout, stderr) {
    if (err) {
      console.log('Build failed: ' + err);
    } else {
      console.log('Build succeed');
    }
    next();
  });
};
