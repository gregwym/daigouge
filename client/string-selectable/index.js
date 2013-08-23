var domify = require('domify'),
    Emitter = require('emitter'),
    Selectable = require('selectable');

module.exports = StringSelectable;

function StringSelectable (strings) {
  var self = this;
  var el = this.el = domify('<ul></ul>');
  for (var i = 0; i < strings.length; i++) {
    el.appendChild(domify(['<li data-name="', strings[i], '">', strings[i], '</li>'].join('')));
  }
  console.log(el);
  var selection = new Selectable('li', el);

  selection.on('change', function(e) {
    self.emit('change', e);
  });
}

Emitter(StringSelectable.prototype);
