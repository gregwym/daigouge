var mongoose = require('mongoose'),
    Types = mongoose.Schema.Types;

// Order status:
//  - orec: Order received
//  - pfg: User has paid for goods
//  - proc: Waiting for shop manager to process the order
//  - doms: Goods has been ordered and domestic shipping in progress
//  - grec: Goods received and waiting for user to pay the shipping fee
//  - pfs: User has paid for the international shipping fee
//  - ints: International shipping in progress
//  - arrv: Package arrived local facility and waiting for dispatching
//  - deli: Package is on its way
//  - comp: Order completed
//  - canc: Order cancelled
//  - refu: Order refunded
var orderStatus = 'recv pfg proc doms grec pfs ints arrv deli comp canc refu'.split(' ');

var requirement = mongoose.Schema({
  k: { type: String, required: true },
  v: { type: String, required: true }
}, {
  _id: false
});

var orderItem = mongoose.Schema({
  prod: { type: Types.ObjectId, ref: 'products', required: true },
  up: { type: Number, required: true },             // Unit price
  q: { type: Number, required: true },              // Quantity
  req: [requirement]
}, {
  _id: false
});

var orderFees = mongoose.Schema({
  k: { type: String, required: true },              // Key
  v: { type: Number, required: true }               // Fee value
}, {
  _id: false
});

var orderTransaction = mongoose.Schema({
  d: { type: Date, default: Date.now },             // When
  v: { type: Number, required: true },              // Payment amount
  u: { type: Types.ObjectId, ref: 'users' },        // Payer
  met: { type: String },                            // Payment method
  msg: { type: String }                             // Extra Message
}, {
  _id: false
});

var orderHistory = mongoose.Schema({
  act: { type: String, required: true },            // Action
  d: { type: Date, default: Date.now },             // When
  u: { type: Types.ObjectId, ref: 'users', required: true }  // Who
}, {
  _id: false
});

var orders = mongoose.Schema({
  user: { type: Types.ObjectId, ref: 'users', required: true },
  stat: { type: String, enum: orderStatus, default: 'recv', required: true },
  req: [requirement],
  items: [orderItem],
  fees: [orderFees],
  trans: [orderTransaction],
  hist: [orderHistory]
});

module.exports = orders;
