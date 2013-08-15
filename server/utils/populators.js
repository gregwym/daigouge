var models = require('models');

exports.products = function(docs, next) {
  models.products.populate(docs, {
    path: 'prod'
  }, next);
};

exports.users = function(docs, next) {
  models.users.populate(docs, {
    path: 'user',
    select: 'email reg'
  }, next);
};
