var request = require('superagent');

exports.fetch = function(url, next) {
  var matchs = url.match(/id=(\w+)/);
  if (matchs.length < 2) {
    return next(new Error('No matching data found'));
  }
  var query = {
    id: matchs[1]
  };

  request.get('/products/new/taobao').query(query).end(function(err, res) {
    next(err, res.body.item);
  });
};

exports.methods = {
  priceTag: function() {
    if (this.item.skus && this.item.skus.sku && this.item.skus.sku.length) {
      return this.item.skus.sku.map(function(sku) { return sku.price; });
    }
    return this.item.price;
  },
  shipping: function() {
    if (this.item.freight_payer == 'seller') { return 0; }
    return this.item.post_fee;
  }
};
