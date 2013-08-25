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
  if (!req.body.item) { return res.status(400).send(); }
  var item = req.body.item;
  debug('Adding ' + JSON.stringify(item) + ' to cart.');

  // Find the product and fetch price
  models.products.findById(item.prod, function(err, product) {
    if (err) { return res.status(500).json(err); }
    item.up = product.priceForProps(item.props);

    // Upsert new item
    req.cart.upsertItem(item, function(err, cart) {
      if (err) { return res.status(500).json(err); }
      res.status(201).json(cart.items);
    });
  });
});

// Remove item
app.delete('/', function(req, res) {
  if (!req.body.item) { return res.status(400).send(); }
  var item = req.body.item;
  debug('Deleting ' + JSON.stringify(item) + ' to cart.');

  req.cart.removeItem(item, function(err, cart) {
    if (err) { return res.status(500).json(err); }
    return res.json(cart);
  });
});
