var express = require('express'),
    utils = require('utils'),
    models = require('models');
var app = module.exports = express();
var debug = require('debug')('cart');

// Settings
app.set('views', __dirname);

// Cart fetching
app.all('*', utils.middlewares.cart);

// List all
app.get('/', function(req, res) {
  utils.populators.products(req.cart.items, function(err, items, plainItems) {
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

  // Searching for existing prod index
  var i = findInItems(req.cart.items, item.prod);
  // Upsert item into array
  req.cart.items.set(i, item);
  req.cart.save(function(err) {
    if (err) { return res.status(500).json(err); }
    res.status(201).json(req.cart.items);
  });
});

// Update item
app.put('/:product', function(req, res) {
  // Searching for existing prod index
  var i = findInItems(req.cart.items, req.params.product);
  // If not found, 404
  if (i == req.cart.items.length) {
    return res.status(404).json(req.cart.items);
  }

  // Perform update
  var item = req.cart.items[i];
  var update = req.body;
  if (update.quantity) {
    item.q = update.quantity;
  }
  // TODO: update requirement

  // Save it
  req.cart.save(function(err) {
    if (err) { return res.status(500).json(err); }
    return res.json(req.cart.items);
  });
});

// Remove item
app.delete('/:product', function(req, res) {
  // Searching for existing prod index
  var i = findInItems(req.cart.items, req.params.product);
  // If not found, 404
  if (i == req.cart.items.length) {
    return res.status(404).json(req.cart.items);
  }

  // Otherwise, remove it
  req.cart.items.splice(i, 1);
  req.cart.save(function(err) {
    if (err) { return res.status(500).json(err); }
    return res.json(req.cart.items);
  });
});

// Helpers
// Searching for product's index
var findInItems = function(items, productId) {
  var i = 0;
  for (; i < items.length; i++) {
    if (items[i].prod == productId) break;
  }
  debug('Product ID: ' + productId + ' found on index ' + i);
  return i;
};
