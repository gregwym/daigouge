var utils = require('utils'),
    debug = require('debug')('taobao'),
    models = require('models');

exports.getProduct = function(query, next) {
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

  utils.top.topClient.query('taobao.item.get', opt, next);
};
