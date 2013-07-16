var mongoose = require('mongoose');

var users = mongoose.Schema({
  uname: String,
  email: String,
  pass: String
});

module.exports = users;
