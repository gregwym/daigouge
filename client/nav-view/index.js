
/**
 * Module dependencies.
 */

var domify = require('domify'),
    html = require('./template'),
    NavItemView = require('nav-item-view');

/**
 * Expose `NavVIew`.
 */

module.exports = NavView;

/**
 * Initialize a new view for `items`.
 *
 * @param {Items} items
 * @api public
 */

function NavView(items) {
  var navList = this.el = domify(html);
  for (var i = 0; i < items.length; i++) {
    var itemView = new NavItemView(items[i]);
    navList.appendChild(itemView.el);
  }
}
