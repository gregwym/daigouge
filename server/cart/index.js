var express = require('express'),
    models = require('models');
var app = module.exports = express();
var debug = require('debug')('cart');

// Settings
app.set('views', __dirname);

var prepareSessionCart = function(req, res, next) {
  models.carts.findOne({ se: req.sessionID }, function(err, cart) {
    if (err) { return next(err); }

    if (cart) {
      req.cart = cart;
      return next();
    }

    req.cart = new models.carts({ se: req.sessionID });
    // Save the cart and move on
    req.cart.save(function(err) {
      return next(err);
    });
  });
};

app.all('*', prepareSessionCart);

// List all
app.get('/', function(req, res) {
  res.expose(JSON.parse(JSON.stringify(req.cart.items)), 'locals.cart');
  res.format({
    html: function() { res.render('all', { cart: req.cart.items }); },
    json: function() { res.json(req.cart.items); }
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
  req.cart.items.remove(req.cart.items[i]);
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
