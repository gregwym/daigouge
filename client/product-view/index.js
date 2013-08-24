var html = require('./template'),
    domify = require('domify'),
    query = require('query'),
    request = require('superagent'),
    AddToCart = require('product-add-to-cart'),
    StringsChoosable = require('strings-choosable'),
    View = require('view');

module.exports = ProductView;

var findSkuByProps = function(props) {
  for (var i = 0; i < this.skus.length; i++) {
    var sku = this.skus[i];
    var match = true;
    for (var key in sku.props) {
      match = match && sku.props[key] == props[key];
    }
    if (match) { return sku; }
  }
  return null;
};

function ProductView(product) {
  this.product = product;
  this.product.findSkuByProps = findSkuByProps;
  this.propsSelection = {};

  // Construct view
  var self = this;
  var el = domify(html);
  View.call(this, product, el);
  this.priceEl = query('.product-price', this.el);

  // Query product-actions element
  var actionsEl = query('.product-actions', this.el);

  // Construct property selections
  var properties = product.properties;
  if (properties) {

    // On selection change handler maker
    var makeOnSelectionChange = function(prop) {
      return function(selected, el) {
        self.updatePropertySelection(prop, selected);
      };
    };

    // Construct selection component for each property
    for (var prop in properties) {
      this.propsSelection[prop] = null;

      // Get all the property values
      var values = [];
      for (var value in properties[prop]) {
        values.push(value);
      }

      // Construct strings-choosable component
      var propsChoosable = new StringsChoosable(values);
      propsChoosable.on('value-change', makeOnSelectionChange(prop));
      actionsEl.appendChild(propsChoosable.el);
    }
  }

  // Construct add-to-cart component
  var addToCart = new AddToCart(this);
  actionsEl.appendChild(addToCart.el);
}

ProductView.prototype.price = function() {
  if (this.product.price.range) {
    return this.product.price.base + ' ~ ' + this.product.price.range;
  } else {
    return this.product.price.base;
  }
};

ProductView.prototype.imageUrl = function() {
  // If no image, return image placeholder
  if (this.product.imgs && this.product.imgs.length !== 0) {
    return this.product.imgs[0].url;
  } else {
    return '';
  }
};

ProductView.prototype.getAddToCartItem = function() {
  return {
    prod: this.product.id,
  };
};

ProductView.prototype.updatePropertySelection = function(property, value) {
  this.propsSelection[property] = value;
  console.log('Properties selection: ' + JSON.stringify(this.propsSelection));
  var sku = this.product.findSkuByProps(this.propsSelection);
  if (sku === null) { return; }

  console.log('Found matched sku: ' + JSON.stringify(sku));
  this.priceEl.textContent = sku.price;
};
