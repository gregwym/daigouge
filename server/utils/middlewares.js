var models = require('models');

exports.cart = function(req, res, next) {
  models.carts.findCartBySession(req.sessionID, function(err, cart) {
    if (err) { return res.status(500).json(err); }
    req.cart = cart;
    next();
  });
};
