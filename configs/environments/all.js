var express = require('express'),
    passport = require('passport'),
    flash = require('connect-flash'),
    MongoStore = require('connect-mongo')(express),
    mongoose = require('mongoose');

module.exports = function(app, basedir) {
  app.set('port', process.env.PORT || 3000);
  app.set('views', basedir + '/app/views');
  app.set('view engine', 'jade');

  // Config middleware invocation sequence
  app.use(express.favicon());
  app.use(express.static(basedir + '/public'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session({
    secret: 'your secret here',
    store: new MongoStore({
      db: mongoose.connection.db
    })
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use(app.router);
};
