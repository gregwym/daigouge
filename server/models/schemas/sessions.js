var mongoose = require('mongoose');

var sessions = mongoose.Schema({
  session: String,
  expires: Date
});

module.exports = sessions;
