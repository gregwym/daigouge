
/**
 * Module dependencies.
 */

var classes = require('classes'),
    domify = require('domify'),
    html = require('./template'),
    View = require('view');

/**
 * Expose `ProductView`.
 */

module.exports = ProductView;

/**
 * Initialize a new view for `product`.
 *
 * @param {Product} product
 * @api public
 */

function ProductView(product) {
  var el = domify(html);
  View.call(this, product, el);
  this.classes = classes(this.el);
}

/**
 * Inherits from `View.prototype`.
 */

ProductView.prototype = Object.create(View.prototype);
