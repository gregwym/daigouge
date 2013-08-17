var utils = require('utils'),
    debug = require('debug')('taobao'),
    models = require('models');

exports.getProduct = function(query, next) {
  var fields = [
    'detail_url',
    'num_iid',
    'title',
    'nick',
    'type',
    'desc',
    'sku.sku_id',
    'sku.price',
    'sku.properties_name',
    'sku.quantity',
    'props_name',
    'property_alias',
    'freight_payer',
    'price',
    'post_fee',
    'express_fee',
    'ems_fee',
    'pic_url'
  ];
  var opt = {
    fields: fields.join(),
    num_iid: query.id
  };

  utils.top.topClient.query('taobao.item.get', opt, next);
};
