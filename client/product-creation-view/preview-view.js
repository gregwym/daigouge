var html = require('./template'),
    domify = require('domify'),
    query = require('query'),
    value = require('value'),
    View = require('view');

module.exports = ProductPreviewView;

function ProductPreviewView(item, strategy) {
  // Save item and add strategy methods
  this.item = item;
  for (var key in strategy.methods) { this[key] = strategy.methods[key]; }

  var els = domify(html);
  var el = query('.product-preview', els);
  console.log(JSON.stringify(item));
  View.call(this, item, el);
}
