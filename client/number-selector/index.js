var domify = require('domify'),
    classes = require('classes'),
    query = require('query'),
    value = require('value'),
    html = require('./template'),
    View = require('view');

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports = Selector;

function Selector(options, onChange) {
  this.conf = {
    dec: options.dec || '-',
    inc: options.dec || '+',
    init: 1,
    min: null,
    max: null,
    step: 1
  };
  if (isNumber(options.init)) { this.conf.init = options.init; }
  if (isNumber(options.min)) { this.conf.min = options.min; }
  if (isNumber(options.max)) { this.conf.max = options.max; }
  if (isNumber(options.step)) { this.conf.step = options.step; }
  this.onChange = onChange || null;

  var el = domify(html);
  View.call(this, this.conf, el);
}

Selector.prototype.value = function(val) {
  var el = query('.number-value', this.el);
  if (val !== null && isNumber(val) &&
      (this.conf.min === null || val >= this.conf.min) &&
      (this.conf.max === null || val <= this.conf.max)) {
    value(el, val);
    this.change();
  }
  return Number(value(el));
};

Selector.prototype.increase = function() {
  var val = this.value() + this.conf.step;
  this.value(val);
};

Selector.prototype.decrease = function() {
  var val = this.value() - this.conf.step;
  this.value(val);
};

Selector.prototype.change = function() {
  if (this.onChange) {
    this.onChange(this.value());
  }
};

Selector.prototype.enable = function(value) {
  var el = query.all('input', this.el);
  if (value) {
    for (var i = 0; i < el.length; i++) {
      el[i].removeAttribute('disabled');
    }
  } else {
    for (var i = 0; i < el.length; i++) {
      el[i].setAttribute('disabled');
    }
  }
};