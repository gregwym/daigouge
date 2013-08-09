var domify = require('domify'),
    query = require('query'),
    request = require('superagent'),
    html = require('./template'),
    NumberSelector = require('number-selector'),
    View = require('view');

module.exports = AddToCart;

function AddToCart(product) {
  if (!product) {
    throw new Error('Missing product information.');
  }

  this.product = product;
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
  var product = this.product;
  var quantity = this.quantitySelector.value();

  // Submit the request
  submitButton.setAttribute('disabled');
  request.post('/cart').send({
    prod: product._id,
    q: quantity
  }).end(function(err, result) {
    if (err) { alert(JSON.stringify(err)); }
    else {
      console.log(product.name + ' * ' + quantity + ' added to the cart.');
    }
    submitButton.removeAttribute('disabled');
  });
};
