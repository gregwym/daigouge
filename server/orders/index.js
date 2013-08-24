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

var formatResult = function(req, res, html) {
  return function(err, result) {
    if (err) { return res.status(500).json(err); }
    return res.format({
      html: function() { html(result); },
      json: function() { res.json(result); }
    });
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
  models.orders.find(formatResult(req, res, function(orders) {
    res.expose(orders.map(function(order) {
      return order.toObject({ virtuals: true });
    }), 'locals.orders');
    res.render('all', { orders: orders });
  }));
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

  // Create order history
  var orderHistory = [{
    act: 'c',
    u: req.user.id
  }];

  // TODO: Address, special requirements, etc...

  // Create new order
  var order = new models.orders({
    user: req.user.id,
    items: req.cart.items,
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

app.get('/:order', function(req, res){
  models.orders.findById(req.params.order, formatResult(req, res, function(order) {
    utils.populators.users(order, function(err, order) {
      if (err) { return res.status(500).json(err); }
      utils.populators.products(order.items, function(err, items) {
        if (err) { return res.status(500).json(err); }
        res.expose(order.toObject({ virtuals: true }), 'locals.order');
        res.render('detail', { order: order });
      });
    });
  }));
});

app.get('/:order/edit', function(req, res){
  models.orders.findById(req.params.order, function(err, order) {
    if (err) { return res.status(500).json(err); }
    return res.send('edit order ' + order);
  });
});

app.put('/:order', function(req, res){
  models.orders.findByIdAndUpdate(req.params.order, req.body || req.query,
                                  resultCallback(req, res));
});

app.delete('/:order',  function(req, res){
  models.products.findByIdAndRemove(req.params.order,
                                    resultCallback(req, res));
});

