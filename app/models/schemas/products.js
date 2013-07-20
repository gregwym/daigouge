var mongoose = require('mongoose');

// Price types:
//  - reg: Regular Price
//  - sale: On sale price
//  - org: Original price fetched from the URL
var priceTypes = 'reg sale org'.split(' ');
var currencies = 'CAD$ US$ RMB¥'.split(' ');

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
  prices: [{                                // Associated prices
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
  }]
});

module.exports = products;
