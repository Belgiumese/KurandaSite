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
    window.smoothScroll = factory(jQuery);
  } else {
    console.log('Could not detect jQuery. Exiting.');
  }
})(function($) {

  var after, before,
    scrolling = false,
    api = {
      setAfter: setAfter,
      setBefore: setBefore,
      isScrolling: isScrolling
    };

  $(document).ready(function() {
    $.easing.easeInOutCubic = easeInOutCubic;
    $('a[href*="#"').click(function(event) {
      var toScroll = $(this.hash),
        offset = toScroll.offset().top - 50,
        relScroll = Math.abs($(window).scrollTop() - offset);
      if (isLocalLink(this) && !scrolling) {
        event.preventDefault();
        if (toScroll.length && relScroll >= 5) {
          triggerScrollStart();
          $('html, body').animate({
            scrollTop: offset
          }, 1000, 'easeInOutCubic', triggerScrollEnd);
        }
      }
    });
  });

  function triggerScrollStart() {
    scrolling = true;
    if (before) {
      before();
    }
  }

  function triggerScrollEnd() {
    scrolling = false;
    if (after) {
      after();
    }
  }

  function isLocalLink(that) {
    return (location.hostname === that.hostname && that.hash.length);
  }

  //Function courtesy of http://gizma.com/easing/
  function easeInOutCubic(a, t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t + b;
    t -= 2;
    return c / 2 * (t * t * t + 2) + b;
  }

  function setAfter(afterIn) {
    after = afterIn;
  }

  function setBefore(beforeIn) {
    before = beforeIn;
  }

  function isScrolling() {
    return scrolling;
  }

  return api;
});