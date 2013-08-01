var NavView = require('nav-view');

module.exports = function() {
  var nav = document.querySelector('.nav');
  var navView = new NavView([
    { name: 'Home', link: '/' },
    { name: 'Products', link: '/products' },
    { name: 'Orders', link: '/orders' },
    { name: 'Cart', link: '/cart' },
    { name: 'Account', link: '/account' }
  ]);
  nav.appendChild(navView.el);
  console.log('NavView created');
};
