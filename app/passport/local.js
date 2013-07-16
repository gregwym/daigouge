var passport = require('passport'),
    models = require('../models'),
    LocalStrategy = require('passport-local').Strategy;

var findById = exports.findById = function(id, done) {
  models.users.findOne({ '_id': id }, done);
};

var findByEmail = exports.findByEmail = function(email, done) {
  models.users.findOne({ 'email': email }, done);
};

var createNewUser = exports.createNewUser = function(email, password, done) {
  findByEmail(email, function(err, user) {
    if(err) { return done(err); }
    if(user) { return done(new Error('Account exists for ' + email)); }

    // Create new user
    user = new models.users({
      'email': email,
      'pass': pass
    });
    user.save(done);
  });
};

exports.init = function() {
  // Use the LocalStrategy within Passport.
  passport.use(new LocalStrategy({
      usernameField: 'email'
    },
    function(email, password, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        // Find the user by email.  If there is no user with the given
        // email, or the password is not correct, set the user to `false` to
        // indicate failure and set a flash message.  Otherwise, return the
        // authenticated `user`.
        findByEmail(email, function(err, user) {
          if (err) { return done(err, false, { message: err }); }
          if (!user) { return done(null, false, { message: 'Unknown Email ' + email }); }
          if (user.pass != password) { return done(null, false, { message: 'Invalid password' }); }
          return done(null, user, { message: 'Welcome ' + email });
        });
      });
    }
  ));

  console.log("Passport initialized with Local Strategy.");
};
