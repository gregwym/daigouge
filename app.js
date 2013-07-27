
/**
 * Module dependencies.
 */

var express = require('express'),
    Resource = require('express-resource'),
    http = require('http');
var app = express();

var storages = require('configs/storages'),
    passports = require('configs/passports'),
    envs = require('configs/environments');

// Setup storages
storages.init(app, __dirname);

// Config passport
passports.init(app, __dirname);

// Config for all environments
envs.all(app, __dirname);

// Config for specific environment
envs[app.get('env')](app, __dirname);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
