var express = require('express');

module.exports = function(app, basedir) {
  app.set('port', process.env.PORT || 3000);
  app.set('views', basedir + '/app/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(basedir + '/public'));
};
