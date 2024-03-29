var html = require('./template'),
    domify = require('domify'),
    query = require('query'),
    CartItemView = require('./cart-item-view'),
    View = require('view');

module.exports = CartView;

function CartView(cart) {
  this.cart = cart || [];
  this.conf = {
    submitText: '提交订单'
  };

  var els = domify(html);
  var el = query('.cart-view', els);
  View.call(this, this.conf, el);

  this.cartList = query('.cart-list', this.el);
  this.submitButton = query('.cart-submit', this.el);
  for (var key in cart) {
    var item = cart[key];
    var itemView = new CartItemView(item);
    this.cartList.appendChild(itemView.el);
  }
}

CartView.prototype.submit = function() {
  window.location = '/orders/new';
};
