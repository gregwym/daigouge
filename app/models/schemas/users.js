var mongoose = require('mongoose');

var users = mongoose.Schema({
  username: String,
  email: String,
  pass: String
});

module.exports = users;
