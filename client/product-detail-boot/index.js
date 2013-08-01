var AddToCart = require('product-add-to-cart');

module.exports = function() {
  var el = document.querySelector('.product-actions');
  var addToCart = new AddToCart(locals.product);
  el.appendChild(addToCart.el);
  console.log('AddToCart component created');
};
