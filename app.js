
/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http');
var app = express();

var routes = require('./configs/routes'),
    configAll = require('./configs/environments/all'),
    configEnv = require('./configs/environments/' + app.get('env'));

// all environments
configAll(app, __dirname);

// environment specified
configEnv(app, __dirname);

// Setup routes
routes.init(app, __dirname);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
