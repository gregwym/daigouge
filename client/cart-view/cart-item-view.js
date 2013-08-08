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
  var el = domify(html);
  View.call(this, item, el);

  var self = this;
  var position = query('.quantity-selector', this.el);
  this.quantitySelector = new NumberSelector({
    min: 1,
    init: item.quantity
  }, function(value) {
    return self.edit(value);
  });
  this.el.replaceChild(this.quantitySelector.el, position);
}

CartItemView.prototype.delete = function() {
  var self = this;
  console.log('Deleteing ' + this.item.product);
  request.post('/cart/' + this.item.product).send({
    _method: 'delete'
  }).end(function(err, result) {
    if (err) { alert(JSON.stringify(err)); return; }
    self.el.parentNode.removeChild(self.el);
  });
};

CartItemView.prototype.edit = function(value) {
  var self = this;
  this.item.quantity = value;
  console.log('Changing ' + this.item.product + ' quantity to ' + value);

  this.quantitySelector.enable(false);
  request.post('/cart').send(this.item).end(function(err, result) {
    if (err) { alert(JSON.stringify(err)); return; }
    self.quantitySelector.enable(true);
  });
};
