var utils = require('utils'),
    debug = require('debug')('taobao'),
    models = require('models');

exports.queryProduct = function(query, next) {
  var fields = [
    'detail_url',
    'wap_detail_url',
    'num_iid',
    'title',
    'nick',
    'type',
    'desc',
    'wap_desc',
    'sku',
    'props_name',
    'property_alias',
    'item_weight',
    'item_size',
    'freight_payer',
    'price',
    'post_fee',
    'express_fee',
    'ems_fee',
    'item_img',
    'prop_img',
    'pic_url'
  ];
  var opt = {
    fields: fields.join(),
    num_iid: query.id
  };

  utils.top.topClient.query('taobao.item.get', opt, function(err, res) {
    if (err) {
      console.error('Fail to get taobao item: ' + JSON.stringify(err));
      return next(err);
    }

    var item = res.item;
    var product = {
      name: item.title,
      url: item.detail_url,
      des: item.desc,
      imgs: [],
      skus: []
    };

    // Format imgs data
    if (item.item_imgs) {
      for (var i = 0; i < item.item_imgs.item_img.length; i++) {
        product.imgs.push({
          url: item.item_imgs.item_img[i].url
        });
      }
    }

    // Format skus data
    if (item.skus) {
      var min = 0, max = 0;
      for (var i = 0; i < item.skus.sku.length; i++) {
        var sku = item.skus.sku[i];

        // Parse props
        var splitProps = sku.properties_name.split(';');
        var props = {};
        for (var j = 0; j < splitProps.length; j++) {
          var kvPairs = splitProps[j].split(':');
          props[kvPairs[2]] = kvPairs[3];
        }

        // Find the price range
        if (i === 0) {
          min = max = sku.price;
        } else if (sku.price < min) {
          min = sku.price;
        } else if (sku.price > max) {
          max = sku.price;
        }

        // Save sku
        product.skus.push({
          props: props,
          price: sku.price
        });
      }

      // Setup price
      var price = { base: min };
      if (min !== max) { price.range = max; }
      product.price = price;
    } else {
      product.price = { base: item.price };
    }

    // Shipping
    product.ship = {
      payer: item.freight_payer
    };
    if (item.post_fee) { product.ship.post = item.post_fee; }
    if (item.ems_fee) { product.ship.ems = item.ems_fee; }
    if (item.express_fee) { product.ship.express = item.express_fee; }

    next(null, product);
  });
};
