var express = require('express');

module.exports = function(app, basename) {
  app.use(express.errorHandler());
};
