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
    window.simpleInView = factory(jQuery);
  } else {
    console.log('Could not detect jQuery. Exiting.');
  }
})(function($) {
  var elements = [],
    settings = {
      triggerEnter: true,
      triggerLeave: true,
      enabled: true
    },

    api = {
      //Modify trigger settings
      settings: function(options) {
        $.extend(settings, options);
      },
      //Modify element settings
      setDefault: function(newProto) {
        $.extend(elemProto.settings, newProto);
      },
      //Know if an element is currently in view
      isinView: function(domElem) {
        var index = elements.findElem(domElem);
        return elements[index].inView;
      },
      enable: function(enabled) {
        settings.enabled = enabled;
      },
      forceUpdate: update
    };

  $(document).ready(function() {
    createInViewEvent();
    $(window).scroll(throttleUpdate);
  });

  function createInViewEvent() {
    $.event.special.inView = {
      add: function(handle) {
        var elems = handle.selector ? $(this).find(handle.selector) : [this];
        for (var i = 0; i < elems.length; i++) {
          var elem = Elem(elems[i]);
          if (handle.data) {
            //force override to avoid prototype being changed
            elem.settings = $.extend({}, elem.settings, handle.data);
          }
          elements.add(elem);
        }
      },
      remove: function(handle) {
        var i = elements.findElem(this);
        elements.splice(i, 1);
      }
    };
  }

  function throttleUpdate() {
    if (typeof throttleUpdate.running === 'undefined') {
      throttleUpdate.running = false;
    }
    if (!throttleUpdate.running) {
      throttleUpdate.running = true;
      requestAnimationFrame(function() {
        update();
        throttleUpdate.running = false;
      });
    }
  }

  function update() {
    if (!elements.length || !settings.enabled) return;

    var scrollAmount = $(window).scrollTop(),
      windowHeight = $(window).height(),
      lastInView = false;

    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      if (element.isInView(scrollAmount, windowHeight)) {
        lastInView = true;
        if (!element.inView) {
          //Is in view when was not previously
          element.inView = true;
          if (settings.triggerEnter) {
            element.$elem.trigger('inView', 'enter');
          }
        }
      } else {
        if (element.inView) {
          element.inView = false;
          if (settings.triggerLeave) {
            element.$elem.trigger('inView', 'leave');
          }
        }
        if (lastInView) {
          //Last element was in view but current one is not,
          //stop checking further elements.
          break;
        }
      }
    }
  }

  elements.add = function(newElem) {
    for (var i = 0; i < this.length; i++) {
      if (isElemBefore(newElem, this[i])) {
        this.splice(i, 0, newElem);
        return;
      }
    }
    elements.push(newElem);
  };

  elements.findElem = function(domElem) {
    for (var i = 0; i < this.length; i++) {
      if (this[i].domElem === domElem) {
        return i;
      }
    }
  };

  function isElemBefore(elem1, elem2) {
    return (elem1.$elem.offset().top <= elem2.$elem.offset().top);
  }

  //Prototype to extend for each element
  var elemProto = {
    inView: false,
    settings: {
      topScreen: 0.15,
      botScreen: 0.85
    },

    isInView: function(scrollAmount, windowHeight) {
      var topElem = this.$elem.offset().top,
        botElem = topElem + this.$elem.height(),
        topScreen = scrollAmount + (windowHeight * this.settings.topScreen),
        botScreen = scrollAmount + (windowHeight * this.settings.botScreen);

      return (botElem > topScreen && topElem < botScreen);
    }
  };

  function Elem(domElem) {
    var instance = Object.create(elemProto);
    instance.domElem = domElem;
    instance.$elem = $(domElem);
    return instance;
  }

  return api;
});