// Initialize with all route definitions
exports.init = function(app, basedir) {
  require('fs').readdirSync(__dirname + '/').forEach(function(file) {
    if (file.match(/.+\.js/g) !== null && file !== 'index.js') {
      var name = file.replace('.js', '');
      var route = require('./' + file);
      route(app);
    }
  });
};
