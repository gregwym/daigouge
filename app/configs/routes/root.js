module.exports = function(app, controllers) {
  app.all('/', controllers.pages.index);
};
