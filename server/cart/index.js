var express = require('express'),
    debug = require('debug')('cart'),
    utils = require('utils'),
    models = require('models');
var app = module.exports = express();

// Settings
app.set('views', __dirname);

// Cart fetching
app.all('*', utils.middlewares.cart);

// List all
app.get('/', function(req, res) {
  utils.populators.products(req.cart.items, function(err, items) {
    var plainItems = items.toObject({ virtuals: true });
    if (err) { return res.status(500).json(err); }
    res.expose(plainItems, 'locals.cart');
    res.format({
      html: function() { res.render('all', { cart: items }); },
      json: function() { res.json(items); }
    });
  });
});

// Add new or Update existing
app.post('/', function(req, res) {
  var item = req.body;
  debug('Adding ' + JSON.stringify(item) + ' to cart.');

  req.cart.upsertItem(item, function(err, cart) {
    if (err) { return res.status(500).json(err); }
    res.status(201).json(cart.items);
  });
});

// Update item
app.put('/:product', function(req, res) {
  // Searching for existing prod index
  var item = req.cart.findItemByProd(req.params.product);
  // If not found, 404
  if (item === null) {
    return res.status(404).json(req.cart.items);
  }

  // Perform update
  var update = req.body;
  if (update.quantity) {
    item.q = update.quantity;
  }
  // TODO: update requirement

  // Save it
  req.cart.lm = Date.now();
  req.cart.save(function(err) {
    if (err) { return res.status(500).json(err); }
    return res.json(req.cart.items);
  });
});

// Remove item
app.delete('/:product', function(req, res) {
  req.cart.removeProd(req.params.product, function(err, cart) {
    if (err) { return res.status(500).json(err); }
    return res.json(cart);
  });
});
