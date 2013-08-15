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

  if (req.xhr) {
    return res.status(401).send();
  }

  // TODO: set jump-back url
  return res.redirect('/auth/local');
});

app.get('/', function(req, res){
  models.orders.find(resultCallback(req, res));
});

app.get('/new', utils.middlewares.cart, function(req, res){
  utils.populators.products(req.cart.items, function(err, items) {
    if (err) { return res.status(500).json(err); }
    res.render('new', { user: req.user, cart: items });
  });
});

app.post('/', utils.middlewares.cart, function(req, res) {
  if (req.cart.items.length === 0) {
    if (req.xhr) {
      return res.status(400).send();
    }
    return res.redirect('/cart');
  }
  // Populate products information
  utils.populators.products(req.cart.items, function(err, items) {
    if (err) { return res.status(500).json(err); }

    // Create order items
    var orderItems = [];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      orderItems.push({
        prod: item.prod.id,
        up: item.prod.unitPrice.v,
        q: item.q,
        req: item.req
      });
    }

    // Create order history
    var orderHistory = [{
      act: 'c',
      u: req.user.id
    }];

    // TODO: Address, special requirements, etc...

    // Create new order
    var order = new models.orders({
      user: req.user.id,
      items: orderItems,
      hist: orderHistory
    });

    // Save it
    order.save(function(err, order){
      if (err) { return res.status(500).json(err); }
      req.cart.remove(function(err) {
        // Do nothing
      });
      return res.redirect(order.id.toString());
    });
  });
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

