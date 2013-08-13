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
  populateProducts(req.cart.items, function(err, items, plainItems) {
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

app.get('/submit', function(req, res) {
  populateProducts(req.cart.items, function(err, items, plainItems) {
    if (err) { return res.status(500).json(err); }
    res.expose(plainItems, 'locals.cart');
    res.render('submit', { user: req.user, cart: items });
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

var populateProducts = function(orgItems, next) {
  models.products.populate(orgItems, {
    path: 'prod'
  }, function(err, items) {
    if (err) { return next(err); }
    // Convert into plain object and fill in unit price.
    var plainItems = JSON.parse(JSON.stringify(items));
    for (var i = 0; i < items.length; i++) {
      plainItems[i].prod.unitPrice = JSON.parse(JSON.stringify(items[i].prod.unitPrice));
    }
    return next(null, items, plainItems);
  });
};
