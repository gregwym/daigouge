var ProductCreationView = require('product-creation-view');

module.exports = function() {
  var el = document.querySelector('.product-creation');
  var creationView = new ProductCreationView('taobao');
  el.parentNode.replaceChild(creationView.el, el);
  console.log('ProductCreationView component created');
};
