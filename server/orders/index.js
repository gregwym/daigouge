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
  models.orders.find(resultCallback(req, res));
});

app.get('/new', function(req, res){
  res.send('new order');
});

app.post('/', function(req, res){
  var order = new models.orders(req.body || req.query);
  order.save(resultCallback(req, res));
});

app.get('/:order', function(req, res){
  models.orders.findOne({ '_id': req.params.order },
                          resultCallback(req, res));
});

app.get('/:order/edit', function(req, res){
  models.orders.findOne({ '_id': req.params.order },
                          function(err, order) {
    if (err) { return res.status(500).json(err); }
    return res.send('edit order ' + order);
  });
});

app.put('/:order', function(req, res){
  models.orders.findOneAndUpdate({ '_id': req.params.order },
                                   req.body || req.query,
                                   resultCallback(req, res));
});

app.delete('/:order',  function(req, res){
  models.products.findOneAndRemove({ '_id': req.params.order },
                                   resultCallback(req, res));
});

