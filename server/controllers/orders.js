var models = require('models');

var resultCallback = function(req, res) {
  return function(err, value) {
    if (err) { return res.status(500).json(err); }
    return res.json(value);
  };
};

exports.index = function(req, res){
  models.orders.find(resultCallback(req, res));
};

exports.new = function(req, res){
  res.send('new order');
};

exports.create = function(req, res){
  var order = new models.orders(req.body || req.query);
  order.save(resultCallback(req, res));
};

exports.show = function(req, res){
  models.orders.findOne({ '_id': req.params.order },
                          resultCallback(req, res));
};

exports.edit = function(req, res){
  models.orders.findOne({ '_id': req.params.order },
                          function(err, order) {
    if (err) { return res.status(500).json(err); }
    return res.send('edit order ' + order);
  });
};

exports.update = function(req, res){
  models.orders.findOneAndUpdate({ '_id': req.params.order },
                                   req.body || req.query,
                                   resultCallback(req, res));
};

exports.destroy = function(req, res){
  models.orders.findOneAndRemove({ '_id': req.params.order },
                                   resultCallback(req, res));
};
