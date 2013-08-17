var request = require('superagent');

exports.fetch = function(url, next) {
  var matchs = url.match(/id=(\w+)/);
  if (matchs.length < 2) {
    return next(new Error('No matching data found'));
  }
  var query = {
    id: matchs[1]
  };

  request.get('/products/new/taobao').query(query).end(function(err, res) {
    next(err, res.body.item);
  });
};
