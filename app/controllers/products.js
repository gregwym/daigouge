var models = require('../models');

exports.index = function(req, res){
  res.send('product index');
};

exports.new = function(req, res){
  res.send('new product');
};

exports.create = function(req, res){
  res.send('create product');
};

exports.show = function(req, res){
  res.send('show product ' + req.params.product);
};

exports.edit = function(req, res){
  res.send('edit product ' + req.params.product);
};

exports.update = function(req, res){
  res.send('update product ' + req.params.product);
};

exports.destroy = function(req, res){
  res.send('destroy product ' + req.params.product);
};
