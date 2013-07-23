var models = require('../models');

var resultCallback = function(req, res) {
  return function(err, value) {
    if (err) { return res.status(500).json(err); }
    return res.json(value);
  };
};

exports.index = function(req, res){
  models.products.find(resultCallback(req, res));
};

exports.new = function(req, res){
  res.render('products/new');
};

exports.create = function(req, res){
  var product = new models.products(req.body || req.query);
  product.save(resultCallback(req, res));
};

exports.show = function(req, res){
  models.products.findOne({ '_id': req.params.product },
                          resultCallback(req, res));
};

exports.edit = function(req, res){
  models.products.findOne({ '_id': req.params.product },
                          function(err, product) {
    if (err) { return res.status(500).json(err); }
    return res.render('products/edit', {
      product: product
    });
  });
};

exports.update = function(req, res){
  var newProduct = req.body;
  req.body.date.c = null;
  models.products.findOneAndUpdate({ '_id': req.params.product },
                                   req.body || req.query,
                                   resultCallback(req, res));
};

exports.destroy = function(req, res){
  models.products.findOneAndRemove({ '_id': req.params.product },
                                   resultCallback(req, res));
};
