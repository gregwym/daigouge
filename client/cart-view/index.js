var html = require('./template'),
    domify = require('domify'),
    query = require('query'),
    View = require('view');
    CartItemView = require('./cart-item-view');

module.exports = CartView;

function CartView(cart) {
  this.cart = cart || {};
  this.conf = {
    submitText: '提交订单'
  };

  var els = domify(html);
  var el = query('.cart-view', els);
  View.call(this, this.conf, el);

  var cartList = query('.cart-list', this.el);
  for (var key in cart) {
    var item = cart[key];
    var itemView = new CartItemView(item);
    cartList.appendChild(itemView.el);
  }
}

CartView.prototype.submit = function() {
  // TODO
};
