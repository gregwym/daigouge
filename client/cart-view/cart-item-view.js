var html = require('./template'),
    domify = require('domify'),
    query = require('query'),
    request = require('superagent'),
    NumberSelector = require('number-selector'),
    View = require('view');

module.exports = CartItemView;

function CartItemView(item) {
  if (!item) {
    throw new Error('Missing item information.');
  }

  this.item = item;
  var els = domify(html);
  var el = query('.cart-item', els);
  View.call(this, item.prod, el);

  var self = this;
  var position = query('.quantity-selector', this.el);
  this.quantitySelector = new NumberSelector({
    min: 1,
    init: item.q
  });
  this.quantitySelector.on('change', function(value) {
    return self.changeQuantity(value);
  });
  this.el.replaceChild(this.quantitySelector.el, position);
}

CartItemView.prototype.priceTag = function() {
  return this.item.up;
};

CartItemView.prototype.delete = function() {
  var self = this;
  console.log('Deleteing ' + this.item.prod.id);
  request.post('/cart/' + this.item.prod.id).send({
    _method: 'delete'
  }).end(function(err, result) {
    if (err) { alert(JSON.stringify(err)); return; }
    self.el.parentNode.removeChild(self.el);
  });
};

CartItemView.prototype.changeQuantity = function(value) {
  if (!value) {
    throw new Error('Cannot have zero or undefined value');
  }
  var self = this;
  console.log('Changing ' + this.item.prod.id + ' quantity to ' + value);

  this.quantitySelector.enable(false);
  request.post('/cart/' + this.item.prod.id).send({
    _method: 'put',
    quantity: value
  }).end(function(err, result) {
    if (err) { alert(JSON.stringify(err)); return; }
    self.quantitySelector.enable(true);
  });
};
