var models = require('models');

exports.main = function(req, res) {
  var locals = {
    page: 'Main',
    user: req.user
  };
  res.render('admin/main', locals);
};

exports.products = function(req, res) {
  models.products.find(function(err, products) {
    if (err) { res.send(500).json(err); }
    var locals = {
      page: 'Products',
      user: req.user,
      products: products
    };
    res.render('admin/products', locals);
  });
};
