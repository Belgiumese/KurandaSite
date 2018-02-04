//Written by Aaron Coox
'use strict';

(function(factory) {
  if (typeof define === 'function' && define.amd) {
    //AMD support
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    //NodeJS support
    module.exports = factory(require('jquery'));
  } else if (jQuery) {
    //No module loaders
    window.expandJs = factory(jQuery);
  } else {
    console.log('Could not detect jQuery. Exiting.');
  }
})(function($) {
  $(document).ready(function() {
    $.easing.easeInOutQuad = easeInOutQuad;
    var wrappers = $('.showMore');
    wrappers.each(function() {
      var wrapper = $(this);
      var expand = wrapper.find('.expand'),
        more = wrapper.find('.more'),
        moreHeight = more.height(),
        expanded = false;

      more.height(0);
      more.css('overflow', 'hidden');

      expand.click(function() {
        if (!expanded) {
          expanded = true;
          more.animate({
            height: moreHeight
          }, 500, 'easeInOutQuad', function() {
            expand.text('Show Less');
          });
        } else {
          expanded = false;
          more.animate({
            height: 0
          }, 500, 'easeInOutQuad', function() {
            expand.text('Show More');
          });
        }
      });
    });
  });

  //Function courtesy of http://gizma.com/easing/
  function easeInOutQuad(a, t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }
});