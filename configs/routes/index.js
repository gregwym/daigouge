// Initialize with all route definitions
exports.init = function(app, basedir) {
  var controllers = require(basedir + '/app/controllers');

  require('fs').readdirSync(__dirname + '/').forEach(function(file) {
    if (file.match(/.+\.js/g) !== null && file !== 'index.js') {
      var name = file.replace('.js', '');
      var route = require('./' + file);
      route(app, controllers);
    }
  });
};
