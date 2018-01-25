//Written by Aaron Coox
'use strict';

(function(factory) {
  if (typeof define === 'function' && define.amd) {
    //AMD support
    define(['jquery', 'simpleInView'], factory);
  } else if (typeof exports === 'object') {
    //NodeJS support
    module.exports = factory(require('jquery'), require('simpleInView'));
  } else if (jQuery && simpleInView) {
    //No module loaders
    window.navUpdate = factory(jQuery, simpleInView);
  } else {
    console.log('Missing jQuery or simpleInView plugins. Exiting.');
  }
})(function($, inview) {
  var sections = [],
    currentSection,
    api = {
      defaults: {
        topScreen: 0.2,
        botScreen: 0.2
      }
    };

  $(document).ready(function() {
    initNavSections();
    initEvents();
  });

  //On the page sections, add data-nav-update with ID of the button
  function initNavSections() {
    var $elems = $('.nav-update');
    for (var i = 0; i < $elems.length; i++) {
      var current = $elems.eq(i);
      current.attr('data-nav-update-id', i);
      sections[i] = {
        $elem: current,
        navBtn: $(current.attr('data-nav-update'))
      };
    }
  }

  function initEvents() {
    for (var i = 0; i < sections.length; i++) {
      sections[i].$elem.on('inView', api.defaults, function(event, type) {
        if (type === 'enter') {
          var navBtn = sections[$(this).attr('data-nav-update-id')].navBtn;
          checkRemoveClass(currentSection, 'nav-update-active');
          currentSection = navBtn;
          checkAddClass(currentSection, 'nav-update-active');
        }
      });
    }
  }

  function checkAddClass(element, className) {
    if (element && !element.hasClass(className)) {
      element.addClass(className);
    }
  }

  function checkRemoveClass(element, className) {
    if (element && element.hasClass(className)) {
      element.removeClass(className);
    }
  }

  return api;
});