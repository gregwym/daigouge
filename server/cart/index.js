var express = require('express'),
    models = require('models');
var app = module.exports = express();

// Settings
app.set('views', __dirname);

var itemField = 'product amount'.split(' ');
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

var format = function(req, res, html) {
  return function(err, result) {
    if (err) { return res.status(500).json(err); }
    return res.format({
      html: function() { html(result); },
      json: function() { res.json(result); }
    });
  };
};

app.get('*', prepareCart);

// List all
app.get('/', function(req, res) {
  res.format({
    html: function() { res.send('list all in cart'); },
    json: function() { res.json(req.session.cart); }
  });
});

// Add new
app.post('/', function(req, res) {
  var item = req.body;
  if (!validItem(item)) {
    return res.status(400);
  }
  req.session.cart[item.product] = item;
  res.status(201).json(req.session.cart);
});

// Update existing
app.put('/:product', function(req, res){
  var item = req.body;
  if (!validItem(item) || item.product != req.params.product) {
    return res.status(400);
  }
  req.session.cart[req.params.product] = item;
  res.json(req.session.cart);
});

// Remove item
app.delete('/:product', function(req, res) {
  if (req.session.cart[req.params.product] !== null) {
    delete req.session.cart[req.params.product];
  }
  res.json(req.session.cart);
});
