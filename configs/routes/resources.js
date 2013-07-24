module.exports = function(app, controllers) {
  app.resource('products', controllers.products);
};
