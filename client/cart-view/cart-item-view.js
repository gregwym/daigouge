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
  this.quantitySelector.on('change', function(e) {
    return self.changeQuantity(e.value);
  });
  this.el.replaceChild(this.quantitySelector.el, position);
}

CartItemView.prototype.priceTag = function() {
  return this.item.up;
};

CartItemView.prototype.delete = function() {
  console.log('Deleteing ' + this.item.prod.id);

  var self = this;
  var data = {
    _method: 'delete',
    item: {
      prod: this.item.prod.id,
      props: this.item.props
    }
  };

  request.post('/cart').send(data).end(function(err, result) {
    if (err) { alert(JSON.stringify(err)); return; }
    self.el.parentNode.removeChild(self.el);
  });
};

CartItemView.prototype.changeQuantity = function(value) {
  if (!value) {
    throw new Error('Cannot have zero or undefined value');
  }
  this.quantitySelector.enable(false);

  var self = this;
  var data = {
    item: {
      prod: this.item.prod.id,
      props: this.item.props,
      q: value
    }
  };

  console.log('Changing ' + JSON.stringify(data.item) + ' quantity to ' + value);
  request.post('/cart').send(data).end(function(err, result) {
    if (err) { alert(JSON.stringify(err)); return; }
    self.item.q = value;
    self.quantitySelector.enable(true);
  });
};
