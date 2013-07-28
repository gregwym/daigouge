var express = require('express'),
    expose = require('express-expose'),
    models = require('models');
var app = module.exports = express();

app.set('views', __dirname);

var formatResult = function(req, res, html) {
  return function(err, result) {
    if (err) { return res.status(500).json(err); }
    return res.format({
      html: function() { html(result); },
      json: function() { res.json(result); }
    });
  };
};

// Index
app.get('/', function(req, res){
  models.products.find(formatResult(req, res, function(products) {
    res.expose(JSON.parse(JSON.stringify(products)), 'locals.products');
    res.render('all', { products: products });
  }));
});

// New
app.get('/new', function(req, res){
  res.render('new');
});

// Create
app.post('/', function(req, res){
  var product = new models.products(req.body || req.query);
  product.save(formatResult(req, res, function(product) {
    res.redirect(product._id.toString());
  }));
});

// Show
app.get('/:product', function(req, res){
  models.products.findOne({ '_id': req.params.product },
                          formatResult(req, res, function(product) {
    res.expose(JSON.parse(JSON.stringify(product)), 'locals.product');
    res.render('detail', { product: product });
  }));
});

// Edit
app.get('/:product/edit', function(req, res){
  models.products.findOne({ '_id': req.params.product },
                          formatResult(req, res, function(product) {
    res.expose(JSON.parse(JSON.stringify(product)), 'locals.product');
    res.render('edit', { product: product });
  }));
});

// Update
app.put('/:product', function(req, res){
  models.products.findOneAndUpdate({ '_id': req.params.product },
                                   req.body || req.query,
                                   formatResult(req, res, function(product) {
    res.redirect(product._id.toString());
  }));
});

// Destroy
app.delete('/:product',  function(req, res){
  models.products.findOneAndRemove({ '_id': req.params.product },
                                   formatResult(req, res, function(product) {
    res.redirect('');
  }));
});

