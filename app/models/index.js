var schemas = require('./schemas'),
    mongoose = require('mongoose');

// Construct models, according to the given schemas.
for(var key in schemas) {
  var schema = schemas[key];
  exports[key] = mongoose.model(key, schema);
}
