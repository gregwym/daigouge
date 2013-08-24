var domify = require('domify'),
    Choosable = require('choosable');

module.exports = StringsChoosable;

function StringsChoosable (strings) {
  var self = this;
  var el = this.el = domify('<ul></ul>');
  for (var i = 0; i < strings.length; i++) {
    el.appendChild(domify(['<li data-value="', strings[i], '">', strings[i], '</li>'].join('')));
  }
  Choosable.call(this, 'li', el);

  this.on('change', function(e) {
    var el = e.selected;
    self.emit('value-change', el.getAttribute('data-value'), el);
  });
}

StringsChoosable.prototype = Object.create(Choosable.prototype);
