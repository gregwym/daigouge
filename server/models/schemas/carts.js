var mongoose = require('mongoose'),
    debug = require('debug')('cart'),
    _ = require('underscore'),
    Types = mongoose.Schema.Types;

// Schema definition

var cartItem = mongoose.Schema({
  prod: { type: Types.ObjectId, ref: 'products', required: true },
  props: { type: mongoose.Schema.Types.Mixed },
  q: { type: Number, required: true, min: 1 },     // Quantity
  up: { type: Number, required: true }             // Unit Price
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

// Methods
carts.methods.indexOfItem = function(item) {
  for (var i = 0; i < this.items.length; i++) {
    if (this.items[i].prod == item.prod) {
      if (this.items[i].props) {
        if (_.isEqual(this.items[i].props, item.props)) { return i; }
      } else { return i; }
    }
  }
  return this.items.length;
};

carts.methods.upsertItem = function(item, next) {
  // Searching for existing item index
  var i = this.indexOfItem(item);
  // Upsert item into array
  this.items.set(i, item);
  this.lm = Date.now();
  this.save(next);
};

carts.methods.removeItem = function(item, next) {
  // Searching for existing item index
  var i = this.indexOfItem(item);
  if (i == this.items.length) {
    var err = new Error('Item not found');
    err.type = 'notfound';
    return next(err);
  }
  this.items.splice(i, 1);
  this.lm = Date.now();
  this.save(next);
};

// Static methods
carts.statics.findCartBySession = function(sessionID, next) {
  var self = this;
  self.findOne({ se: sessionID }, function(err, cart) {
    if (err) { return next(err); }

    if (cart) {
      return next(null, cart);
    }

    cart = new self({ se: sessionID });
    // Save the cart and move on
    cart.save(next);
  });
};

module.exports = carts;
