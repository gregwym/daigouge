var schemas = require('./schemas'),
    mongoose = require('mongoose');

for(var key in schemas) {
  var schema = schemas[key];
  exports[key] = mongoose.model(key, schema);
}
