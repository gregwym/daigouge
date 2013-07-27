var NavView = require('nav-view');

module.exports = function() {
  var nav = document.querySelector('.nav');
  var navView = new NavView([
    { name: 'Home', link: '/' },
    { name: 'My Diggos', link: '/my-account' }
  ]);
  nav.appendChild(navView.el);
  console.log('NavView created');
};
