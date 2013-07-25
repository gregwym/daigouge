
/**
 * Module dependencies.
 */

var express = require('express'),
    Resource = require('express-resource'),
    http = require('http');
var app = express();

var routes = require('configs/routes'),
    storages = require('configs/storages'),
    passports = require('configs/passports'),
    configAll = require('configs/environments/all'),
    configEnv = require('configs/environments/' + app.get('env'));

// Setup storages
storages.init(app, __dirname);

// Config for all environments
configAll(app, __dirname);

// Config for specific environment
configEnv(app, __dirname);

// Config passport
passports.init(app, __dirname);

// Setup routes
routes.init(app, __dirname);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
