var CartItemView = require('./cart-item-view');

module.exports = CartView;

function CartView(cart) {
  this.cart = cart || {};

  var el = this.el = document.createElement('ul');
  el.setAttribute('class', 'cart-view');

  for (var key in cart) {
    var item = cart[key];
    var itemView = new CartItemView(item);
    el.appendChild(itemView.el);
  }
}
