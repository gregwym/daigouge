var passport = require('passport'),
    models = require('../models'),
    LocalStrategy = require('passport-local').Strategy;

var findById = exports.findById = function(id, done) {
  models.users.findOne({ '_id': id }, function(err, user) {
    if(err) {
      return done(err);
    }

    if (user) {
      return done(null, user);
    } else {
      return done(new Error('Invalid user id'));
    }
  });
};

var findByUsername = exports.findByUsername = function(username, done) {
  models.users.findOne({ 'uname': username }, function(err, user) {
    if(err) {
      return done(err);
    }

    if (user) {
      return done(null, user);
    } else {
      return done(new Error('Invalid username'));
    }
  });
};

exports.init = function() {
  // Use the LocalStrategy within Passport.
  //   Strategies in passport require a `verify` function, which accept
  //   credentials (in this case, a username and password), and invoke a callback
  //   with a user object.  In the real world, this would query a database;
  //   however, in this example we are using a baked-in set of users.
  passport.use(new LocalStrategy(
    function(username, password, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        // Find the user by username.  If there is no user with the given
        // username, or the password is not correct, set the user to `false` to
        // indicate failure and set a flash message.  Otherwise, return the
        // authenticated `user`.
        findByUsername(username, function(err, user) {
          console.log('Authenticating: ' + username + ' Err: ' + err + ' User: ' + user);
          if (err) { return done(err, false, { message: 'Error: ' + err }); }
          if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
          if (user.pass != password) { return done(null, false, { message: 'Invalid password' }); }
          console.log('User authenticated.');
          return done(null, user);
        });
      });
    }
  ));

  console.log("Passport initialized with Local Strategy.");
};
