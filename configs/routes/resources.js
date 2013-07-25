module.exports = function(app, controllers) {
  app.resource('products', controllers.products);
  app.resource('orders', controllers.orders);
};
