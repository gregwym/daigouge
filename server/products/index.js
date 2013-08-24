var express = require('express'),
    expose = require('express-expose'),
    strategies = require('./strategies'),
    models = require('models');
var app = module.exports = express();

app.set('views', __dirname);

var formatResult = function(req, res, html) {
  return function(err, result) {
    if (err) { return res.status(500).json(err); }
    if (result === null) { return res.status(404).send(); }
    return res.format({
      html: function() { html(result); },
      json: function() { res.json(result.toObject({ virtuals: true })); }
    });
  };
};

// Index
app.get('/', function(req, res){
  models.products.find(formatResult(req, res, function(products) {
    res.expose(products.map(function(product) {
      return product.toObject({ virtuals: true });
    }), 'locals.products');
    res.render('all', { products: products });
  }));
});

// Create
app.post('/', function(req, res){
  var product = new models.products(req.body || req.query);
  product.save(formatResult(req, res, function(product) {
    res.redirect(product.id.toString());
  }));
});

app.post('/:strategy', function(req, res){
  var strategy = strategies[req.params.strategy];
  if (!strategy) { return res.status(404).send(); }

  strategy.queryProduct(req.body, function(err, result) {
    if (err) { return res.status(500).json(err); }
    var product = new models.products(result);
    product.save(formatResult(req, res, function(product) {
      res.redirect(product.id.toString());
    }));
  });
});

// Show
app.get('/:product', function(req, res){
  models.products.findById(req.params.product,
                           formatResult(req, res, function(product) {
    res.expose(product.toObject({ virtuals: true }), 'locals.product');
    res.render('detail', { product: product });
  }));
});

// Update
app.put('/:product', function(req, res){
  models.products.findByIdAndUpdate(req.params.product, req.body || req.query,
                                    formatResult(req, res, function(product) {
    res.redirect(product.id.toString());
  }));
});

// Destroy
app.delete('/:product',  function(req, res){
  models.products.findByIdAndRemove(req.params.product,
                                    formatResult(req, res, function(product) {
    res.redirect('');
  }));
});

