var mongoose = require('mongoose');

var users = mongoose.Schema({
  email: String,
  pass: String
});

users.statics.findByEmail = function(email, done) {
  this.findOne({ 'email': email }, done);
};

users.statics.findById = function(id, done) {
  this.findOne({ '_id': id }, done);
};

users.statics.create = function(email, password, done) {
  var self = this;
  this.findByEmail(email, function(err, user) {
    if(err) { return done(err); }
    if(user) { return done(new Error('Account exists for ' + email)); }

    // Create new user
    user = new self({
      'email': email,
      'pass': password
    });
    user.save(done);
  });
};

module.exports = users;
