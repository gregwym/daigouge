var models = require('../models');

exports.index = function(req, res){
  models.products.find(function(err, products) {
    if (err) { return res.status(500).json(err); }
    return res.json(products);
  });
};

exports.new = function(req, res){
  res.render('products/new');
};

exports.create = function(req, res){
  var product = new models.products(req.body || req.query);
  product.save(function(err, product) {
    if (err) { return res.status(500).json(err); }
    return res.json(product);
  });
};

exports.show = function(req, res){
  models.products.findOne({ '_id': req.params.product }, function(err, product) {
    if (err) { return res.status(500).json(err); }
    return res.json(product);
  });
};

exports.edit = function(req, res){
  models.products.findOne({ '_id': req.params.product }, function(err, product) {
    if (err) { return res.status(500).json(err); }
    return res.render('products/edit', {
      product: product
    });
  });
};

exports.update = function(req, res){
   models.products.findOneAndUpdate({ '_id': req.params.product },
                          req.body || req.query,
                          function(err, product) {
    if (err) { return res.status(500).json(err); }
    return res.json(product);
  });
};

exports.destroy = function(req, res){
  models.products.findOneAndRemove({ '_id': req.params.product }, function(err, product) {
    if (err) { return res.status(500).json(err); }
    return res.json(product);
  });
};
