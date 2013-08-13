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
  lm: {                                             // Last modified date
    type: Date,
    default: Date.now,
    expires: '24h'
  },
  items: [cartItem],
});

carts.statics.findCartBySession = function(sessionID, next) {
  var self = this;
  self.findOne({ se: sessionID }, function(err, cart) {
    if (err) { return next(err); }

    if (cart) {
      return next(null, cart);
    }

    cart = new self({ se: sessionID });
    // Save the cart and move on
    cart.save(function(err) {
      return next(err, cart);
    });
  });
};

module.exports = carts;
