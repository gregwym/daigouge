var models = require('../models');

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/auth/local');
};

exports.local = function(req, res) {
  res.render('auth/local', {
    user: req.user,
    error: req.flash('error'),
    success: req.flash('success')
  });
};

exports.local.register = function(req, res) {
  var email = req.body.email,
      password = req.body.password;

  // Both field are required
  if(!email || !password) {
    req.flash('error', 'Please fill both Email and Password');
    return res.redirect('/auth/local');
  }

  // Try create a new user, flash 'error' message if failed.
  models.users.create(email, password, function(err, user) {
    if(err) {
      req.flash('error', 'Fail to register - ' + err);
      return res.redirect('/auth/local');
    } else {
      req.login(user, function(err) {
        if(err) { req.flash('error', 'Fail to login - ' + err); }
        else { req.flash('success', 'Account ' + email + ' created'); }
        return res.redirect('/auth/local');
      });
    }
  });
};
