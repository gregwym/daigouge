var passport = require('passport'),
    models = require('models'),
    local = require('./local');

exports.init = function() {
  // Passport session setup.
  //   To support persistent login sessions, Passport needs to be able to
  //   serialize users into and deserialize users out of the session.
  passport.serializeUser(function(user, done) {
    return done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    // Find the user in db
    return models.users.findById(id, done);
  });

  local.init();

  console.log("Passport initialized.");
};
