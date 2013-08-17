var html = require('./template'),
    domify = require('domify'),
    query = require('query'),
    value = require('value'),
    PreviewView = require('./preview-view'),
    View = require('view');

module.exports = ProductCreationView;

function ProductCreationView(strategy) {
  var els = domify(html);
  var el = query('.product-creation', els);
  View.call(this, {
    urlPlaceholder: 'URL',
    fetchText: 'Go'
  }, el);

  this.urlText = query('.product-original-url', this.el);
  this.strategy = require('./' + strategy);
}

ProductCreationView.prototype.fetch = function() {
  var self = this;
  var url = value(self.urlText);
  self.strategy.fetch(url, function(err, item) {
    var previewView = new PreviewView(item);
    var oldEl = query('.product-preview', self.el);
    if (oldEl) {
      self.el.replaceChild(previewView.el, oldEl);
    } else {
      self.el.appendChild(previewView.el);
    }
  });
};
