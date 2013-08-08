var CartView = require('cart-view');

module.exports = function() {
  var el = document.querySelector('.cart');
  var addToCart = new CartView(locals.cart);
  el.appendChild(addToCart.el);
  console.log('CartView component created');
};
