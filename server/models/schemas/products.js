var mongoose = require('mongoose');

// Price types:
//  - reg: Regular Price
//  - sale: On sale price
//  - org: Original price fetched from the URL
var priceTypes = 'reg sale org'.split(' ');
var currencies = 'CAD$ US$ RMB¥'.split(' ');

var productPrice = mongoose.Schema({
  value: { type: Number, required: true },  // Price value
  type: {                                   // Price type
    type: String,
    enum: priceTypes,
    default: priceTypes[0],
    required: true
  },
  cur: {                                    // Price currency (optional)
    type: String,
    enum: currencies
  }
}, {
  _id: false
});

var products = mongoose.Schema({
  name: { type: String, required: true },   // Product name
  date: {                                   // Associated dates
    c: { type: Date, default: Date.now },     // Created date
    lm: { type: Date, default: Date.now }     // Last modified date
  },
  url: {                                    // Product source URL
    type: String,
    match: /^https{0,1}:\/\/.+/,
    required: true
  },
  prices: [productPrice]                    // Associated prices
});

products.methods.price = function(type) {
  for (var i = 0; i < this.prices.length; i++) {
    var price = this.prices[i];
    if (price.type === type) { return price; }
  }
  return null;
};

module.exports = products;
