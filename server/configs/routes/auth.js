var passport = require('passport');

module.exports = function(app, controllers) {
  app.get('/auth/logout', controllers.auth.logout);
  app.get('/auth/local', controllers.auth.local);
  app.post('/auth/local',
           passport.authenticate('local',
                                 { successRedirect: '/auth/local',
                                   failureRedirect: '/auth/local',
                                   successFlash: true,
                                   failureFlash: true }));
  app.post('/auth/local/new', controllers.auth.local.register);
};
