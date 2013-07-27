var express = require('express'),
    passport = require('passport'),
    models = require('models');
var app = module.exports = express();

// Settings
app.set('views', __dirname);

// General logout
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('back');
});

// Local Auth
app.get('/local', function(req, res) {
  res.render('local', {
    user: req.user,
    error: req.flash('error'),
    success: req.flash('success')
  });
});

app.post('/local', passport.authenticate('local', {
  successRedirect: 'local',
  failureRedirect: 'local',
  successFlash: true,
  failureFlash: true
}));

app.post('/local/new', function(req, res) {
  var email = req.body.email,
      password = req.body.password;

  // Try create a new user, flash 'error' message if failed.
  models.users.create(email, password, function(err, user) {
    if(err) {
      req.flash('error', 'Fail to register - ' + err.message);
      return res.redirect('local');
    } else {
      req.login(user, function(err) {
        if(err) { req.flash('error', 'Fail to login - ' + err.message); }
        else { req.flash('success', 'Account ' + email + ' created'); }
        return res.redirect('local');
      });
    }
  });
});
