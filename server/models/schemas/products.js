var mongoose = require('mongoose');

var currencies = 'CAD$ US$ RMB¥'.split(' ');

var productSku = mongoose.Schema({
  props: { type: mongoose.Schema.Types.Mixed, require: true },
  price: { type: Number, require: true }
}, {
  _id: false
});

var productImage = mongoose.Schema({
  url: {
    type: String,
    match: /^https{0,1}:\/\/.+/
  },
  jpg: Buffer,
  png: Buffer
}, {
  _id: false
});

var products = mongoose.Schema({
  name: { type: String, required: true },   // Product name
  lm: { type: Date, default: Date.now },    // Last modified date
  url: {                                    // Product source URL
    type: String,
    match: /^https{0,1}:\/\/.+/,
    required: true
  },
  imgs: [productImage],                     // Product Images
  des: {                                    // Product description
    type: String
  },
  price: {
    base: Number,
    range: Number
  },
  skus: [productSku],
  ship: {
    post: Number,
    ems: Number,
    express: Number,
    payer: String
  }
});

products.methods.findSkuByProps = function(props) {
  for (var i = 0; i < this.skus.length; i++) {
    var sku = this.skus[i];
    var match = true;
    for (var key in sku.props) {
      match = match && sku.props[key] == props[key];
    }
    if (match) { return sku; }
  }
  return null;
};

products.virtual('properties').get(function() {
  var properties = {};
  this.skus.forEach(function(sku) {
    var props = sku.props;
    for (var key in props) {
      if (!properties[key]) {
        properties[key] = {};
      }
      properties[key][props[key]] = true;
    }
  });
  return properties;
});

module.exports = products;
