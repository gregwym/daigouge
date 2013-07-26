var passport = require('passport');

checkPermission = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/auth/local");
};

module.exports = function(app, controllers) {
  var admin = controllers.admin;
  app.all('/admin*', checkPermission);
  app.get('/admin', admin.main);
  app.get('/admin/products', admin.products);
};
