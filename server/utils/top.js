var debug = require('debug')('taobao');

exports.topClient = require('top.js').createClient({
  app_key: process.env.TOP_APP_KEY,
  app_secret: process.env.TOP_APP_SECRET,
  debug: process.env.DEBUG.indexOf('taobao') != -1
});
