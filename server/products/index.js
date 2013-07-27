var express = require('express'),
    models = require('models');
var app = module.exports = express();

app.set('views', __dirname);

var resultCallback = function(req, res) {
  return function(err, value) {
    if (err) { return res.status(500).json(err); }
    return res.json(value);
  };
};

app.get('/', function(req, res){
  models.products.find(resultCallback(req, res));
});

app.get('/new', function(req, res){
  res.render('new');
});

app.post('/', function(req, res){
  var product = new models.products(req.body || req.query);
  product.save(resultCallback(req, res));
});

app.get('/:product', function(req, res){
  models.products.findOne({ '_id': req.params.product },
                          resultCallback(req, res));
});

app.get('/:product/edit', function(req, res){
  models.products.findOne({ '_id': req.params.product },
                          function(err, product) {
    if (err) { return res.status(500).json(err); }
    return res.render('edit', {
      product: product
    });
  });
});

app.put('/:product', function(req, res){
  models.products.findOneAndUpdate({ '_id': req.params.product },
                                   req.body || req.query,
                                   resultCallback(req, res));
});

app.delete('/:product',  function(req, res){
  models.products.findOneAndRemove({ '_id': req.params.product },
                                   resultCallback(req, res));
});

