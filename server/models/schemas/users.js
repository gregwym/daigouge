var mongoose = require('mongoose');

var users = mongoose.Schema({
  email: {
    type: String,
    match: /^[\w\d\._+-]+@(\w+\.)+\w+$/,
    lowercase: true,
    required: true,
    unique: true
  },
  pass: { type: String, required: true },
  reg: { type: Date, default: Date.now }
});

var ValidationErrors = {
  REQUIRED: 'required',
  NOTVALID: 'notvalid',
  REGEX: 'regexp'
};

users.statics.findByEmail = function(email, done) {
  this.findOne({ 'email': email }, done);
};

users.statics.create = function(email, password, done) {
  // Create new user
  var user = new this({
    'email': email,
    'pass': password
  });
  // Save it
  user.save(function(err, user) {
    // If failed to save, find out the error and return proper message.
    var message = '';
    if (err && err.name === 'MongoError') {
      // Handle mongodb error
      if (err.err.indexOf('duplicate') !== -1) {
        message += 'Account "' + email + '" already exists.';
      } else {
        message += err;
      }
      return done(new Error(message));
    } else if (err && err.errors) {
      // Handle validation errors
      for (var errName in err.errors) {
        var error = err.errors[errName];
        switch(error.type) {
          case ValidationErrors.REQUIRED:
            message += '"' + error.path + '" cannot be empty. ';
            break;
          case ValidationErrors.NOTVALID:
            message += '"' + error.path + '" is not valid. ';
            break;
          case ValidationErrors.REGEX:
            message += '"' + error.value + '" is not a valid ' + error.path + '. ';
            break;
          default:
            break;
        }
      }
      return done(new Error(message));
    } else if (err) {
      return done(err);
    }

    // Otherwise, everything good.
    return done(null, user);
  });
};

users.methods.validPass = function(pass) {
  return pass === this.pass;
};

module.exports = users;
