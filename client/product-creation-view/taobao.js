var request = require('superagent');

exports.name = 'taobao';

exports.postData = function(url) {
  var matchs = url.match(/id=(\w+)/);
  if (matchs.length < 2) {
    throw new Error('No matching id found');
  }
  var post = {
    id: matchs[1]
  };

  return post;
};
