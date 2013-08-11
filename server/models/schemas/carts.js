var mongoose = require('mongoose'),
    Types = mongoose.Schema.Types;

var requirement = mongoose.Schema({
  k: { type: String, required: true },
  v: { type: String, required: true }
}, {
  _id: false
});


var cartItem = mongoose.Schema({
  prod: { type: Types.ObjectId, ref: 'products', required: true, unique: true },
  q: { type: Number, required: true },             // Quantity
  req: [requirement]
}, {
  _id: false
});


var carts = mongoose.Schema({
  se: { type: Types.ObjectId, ref: 'sessions' },    // Session
  c: {                                              // Create date
    type: Date,
    default: Date.now,
    expires: '24h'
  },
  items: [cartItem],
});

module.exports = carts;
