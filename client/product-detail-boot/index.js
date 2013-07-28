var ProductView = require('product-detail-view');

module.exports = function() {
  var product = document.querySelector('.product');
  var productView = new ProductView(locals.product);
  product.appendChild(productView.el);
  console.log('ProductView created');
};
