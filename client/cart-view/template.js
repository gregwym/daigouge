module.exports = '<div class="cart-view">\n  <ul class="cart-list"></ul>\n  <input type="button" on-click="submit" value="submit" data-value="submitText">\n</div>\n<li class="cart-item">\n  <a data-href="/products/{_id}"><label class="product-name" data-text="name"></label></a>\n  <div class="quantity-selector"></div>\n  <label class="product-unit-price" data-text="priceTag"></label>\n  <input type="button" class="x" on-click="delete" value="✕">\n</li>\n';