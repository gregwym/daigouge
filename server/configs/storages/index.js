// Initialize with all storage definitions
exports.init = function(app, basedir) {
  require('fs').readdirSync(__dirname + '/').forEach(function(file) {
    if (file.match(/.+\.js/g) !== null && file !== 'index.js') {
      var storage = require('./' + file);
      storage();
    }
  });
};
