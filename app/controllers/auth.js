var models = require('models');

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

  // Try create a new user, flash 'error' message if failed.
  models.users.create(email, password, function(err, user) {
    if(err) {
      req.flash('error', 'Fail to register - ' + err.message);
      return res.redirect('/auth/local');
    } else {
      req.login(user, function(err) {
        if(err) { req.flash('error', 'Fail to login - ' + err.message); }
        else { req.flash('success', 'Account ' + email + ' created'); }
        return res.redirect('/auth/local');
      });
    }
  });
};
