var mongoose = require('mongoose'),
    debug = require('debug')('cart'),
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
// TODO: Same product with different requirement can exists simultaneously
carts.methods.indexOfProd = function(prod) {
  var i = 0;
  for (; i < this.items.length; i++) {
    if (this.items[i].prod == prod) break;
  }
  return i;
};

carts.methods.findItemByProd = function(prod) {
  for (var i = 0; i < this.items.length; i++) {
    if (this.items[i].prod == prod) return this.items[i];
  }
  return null;
};

carts.methods.upsertItem = function(item, next) {
  // Searching for existing prod index
  var i = this.indexOfProd(item.prod);
  // Upsert item into array
  this.items.set(i, item);
  this.lm = Date.now();
  this.save(next);
};

carts.methods.removeProd = function(prod, next) {
  // Searching for existing prod index
  var i = this.indexOfProd(prod);
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
