var models = require('models');

exports.products = function(orgItems, next) {
  models.products.populate(orgItems, {
    path: 'prod'
  }, function(err, items) {
    if (err) { return next(err); }
    // Convert into plain object and fill in unit price.
    var plainItems = JSON.parse(JSON.stringify(items));
    for (var i = 0; i < items.length; i++) {
      plainItems[i].prod.unitPrice = JSON.parse(JSON.stringify(items[i].prod.unitPrice));
    }
    return next(null, items, plainItems);
  });
};
