var express = require('express'),
    debug = require('debug')('orders'),
    utils = require('utils'),
    models = require('models');
var app = module.exports = express();

app.set('views', __dirname);

var resultCallback = function(req, res) {
  return function(err, value) {
    if (err) { return res.status(500).json(err); }
    return res.json(value);
  };
};

app.all('*', function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  debug('Not authenticated.');
  if (req.method === 'GET') {
    // TODO: set jump-back url
    return res.redirect('/auth/local');
  }
  return res.status(401).send();
});

app.get('/', function(req, res){
  models.orders.find(resultCallback(req, res));
});

app.get('/new', utils.middlewares.cart, function(req, res){
  utils.populators.products(req.cart.items, function(err, items, plainItems) {
    if (err) { return res.status(500).json(err); }
    res.render('new', { user: req.user, cart: items });
  });
});

app.post('/', function(req, res){
  var orderItems = [];
  for (var i in req.body) {
    var item = req.body[i];
    orderItems.push({
      prod: item.prod._id,
      up: item.prod.unitPrice.v,
      q: item.q,
      req: item.req
    });
  }

  var orderHistory = [{
    act: 'c',
    u: req.user._id
  }];

  var order = new models.orders({
    user: req.user._id,
    items: orderItems,
    hist: orderHistory
  });
  order.save(resultCallback(req, res));
  // return res.status(201).json(order);
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

