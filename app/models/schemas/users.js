var mongoose = require('mongoose');

var users = mongoose.Schema({
  email: String,
  pass: String
});

module.exports = users;
