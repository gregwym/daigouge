var html = require('./template'),
    domify = require('domify'),
    query = require('query'),
    value = require('value'),
    request = require('superagent'),
    ProductView = require('product-view'),
    View = require('view');

module.exports = ProductCreationView;

function ProductCreationView(strategy) {
  var el = domify(html);
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
  var post = self.strategy.postData(url);
  request
    .post('/products/' + self.strategy.name)
    .set('Accept', 'application/json')
    .send(post)
    .end(function(err, res) {
      if (err) { return alert(JSON.stringify(err)); }

      var productView = new ProductView(res.body);
      var el = query('.product-view', self.el);
      self.el.replaceChild(productView.el, el);
    });
};
