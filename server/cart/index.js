var express = require('express'),
    models = require('models');
var app = module.exports = express();
var debug = require('debug')('cart');

// Settings
app.set('views', __dirname);

var itemField = 'product quantity'.split(' ');
var validItem = function(item) {
  if (item === null) { return false; }
  for (var i = 0; i < itemField.length; i++) {
    if (item[itemField[i]] === null ) { return false; }
  }
  return true;
};

var prepareCart = function(req, res, next) {
  req.session.cart = req.session.cart || {};
  next();
};

app.all('*', prepareCart);

// List all
app.get('/', function(req, res) {
  res.format({
    html: function() { res.send(req.session.cart); },
    json: function() { res.json(req.session.cart); }
  });
});

// Add new or Update existing
app.post('/', function(req, res) {
  var item = req.body;
  if (!validItem(item)) {
    return res.status(400);
  }
  debug('Adding ' + JSON.stringify(item) + ' to cart.');
  req.session.cart[item.product] = item;
  res.status(201).json(req.session.cart);
});

// Remove item
app.delete('/:product', function(req, res) {
  var item = req.session.cart[req.params.product];
  if (item) {
    debug('Deleting ' + JSON.stringify(item) + ' from cart.');
    delete req.session.cart[req.params.product];
  }
  res.json(req.session.cart);
});
