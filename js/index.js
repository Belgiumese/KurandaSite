'use strict';

$(document).ready(function() {
  initSmoothScroll();
});

function initSmoothScroll() {
  smoothScroll.setBefore(function() {
    simpleInView.enable(false);
  });
  smoothScroll.setAfter(function() {
    simpleInView.enable(true);
    simpleInView.forceUpdate();
  });
  simpleInView.forceUpdate();
}