
/**
 * Module dependencies.
 */

var classes = require('classes'),
    domify = require('domify'),
    html = require('./template'),
    View = require('view');

/**
 * Expose `ItemView`.
 */

module.exports = ItemView;

/**
 * Initialize a new view for `item`.
 *
 * @param {Item} item
 * @api public
 */

function ItemView(item) {
  var el = domify(html);
  View.call(this, item, el);
  this.classes = classes(this.el);
}

/**
 * Inherits from `View.prototype`.
 */

ItemView.prototype = Object.create(View.prototype);
