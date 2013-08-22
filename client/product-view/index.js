var html = require('./template'),
    domify = require('domify'),
    query = require('query'),
    request = require('superagent'),
    AddToCart = require('product-add-to-cart'),
    View = require('view');

module.exports = ProductView;

function ProductView(product) {
  this.product = product;

  var el = domify(html);
  View.call(this, product, el);

  var actionsEl = query('.product-actions', this.el);
  var addToCart = new AddToCart(this);
  actionsEl.appendChild(addToCart.el);
}

ProductView.prototype.price = function() {
  if (this.product.price.range) {
    return this.product.price.base + ' ~ ' + this.product.price.range;
  } else {
    return this.product.price.base;
  }
};

ProductView.prototype.imageUrl = function() {
  // If no image, return image placeholder
  if (this.product.imgs && this.product.imgs.length !== 0) {
    return this.product.imgs[0].url;
  } else {
    return '';
  }
};

ProductView.prototype.getAddToCartItem = function() {
  return {
    prod: this.product.id,
  };
};
