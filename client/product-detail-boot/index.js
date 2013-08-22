var ProductView = require('product-view');

module.exports = function() {
  var el = document.querySelector('.product-view');
  var productView = new ProductView(locals.product);
  el.parentNode.replaceChild(productView.el, el);
};
