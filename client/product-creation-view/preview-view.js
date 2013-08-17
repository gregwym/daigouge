var html = require('./template'),
    domify = require('domify'),
    query = require('query'),
    value = require('value'),
    View = require('view');

module.exports = ProductPreviewView;

function ProductPreviewView(item) {
  var els = domify(html);
  var el = query('.product-preview', els);
  console.log(JSON.stringify(item));
  View.call(this, item, el);
}
