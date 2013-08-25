var domify = require('domify'),
    query = require('query'),
    request = require('superagent'),
    html = require('./template'),
    NumberSelector = require('number-selector'),
    View = require('view');

module.exports = AddToCart;

function AddToCart(delegate) {
  if (!delegate && !delegate.getAddToCartItem) {
    throw new Error('AddToCart has to work with a delegate.');
  }

  this.delegate = delegate;
  this.conf = {
    submitText: '加入购物车'
  };
  var el = domify(html);
  View.call(this, this.conf, el);

  this.quantitySelector = new NumberSelector({ min: 1 });
  this.submitButton = query('.add-to-cart-submit', this.el);
  this.el.insertBefore(this.quantitySelector.el, this.submitButton);
}

AddToCart.prototype.submit = function() {
  var submitButton = this.submitButton;
  var data = {
    item: this.delegate.getAddToCartItem()
  };
  data.item.q = this.quantitySelector.value();

  // Submit the request
  submitButton.setAttribute('disabled');
  request.post('/cart').send(data).end(function(err, result) {
    if (err) { alert(JSON.stringify(err)); }
    else {
      console.log(JSON.stringify(data.item) + ' added to the cart.');
    }
    submitButton.removeAttribute('disabled');
  });
};

AddToCart.prototype.enable = function(value) {
  var els = query.all('input', this.el);
  if (value) {
    for (var i = 0; i < els.length; i++) {
      els[i].removeAttribute('disabled');
    }
  } else {
    for (var i = 0; i < els.length; i++) {
      els[i].setAttribute('disabled');
    }
  }
};
