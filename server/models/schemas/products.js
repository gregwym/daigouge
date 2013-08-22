var mongoose = require('mongoose');

var currencies = 'CAD$ US$ RMB¥'.split(' ');

var productProperty = mongoose.Schema({
  k: String,
  v: String
}, {
  _id: false
});

var productSku = mongoose.Schema({
  props: [productProperty],
  price: { type: Number }
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

module.exports = products;
