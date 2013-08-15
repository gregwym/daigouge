var models = require('models');

exports.products = function(orgItems, next) {
  models.products.populate(orgItems, {
    path: 'prod'
  }, next);
};
