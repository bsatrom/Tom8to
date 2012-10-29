 (function () {
  'use strict';

  var displayRequest = new Windows.System.Display.DisplayRequest();

  Observer.subscribe('Timer.start', function () {
    displayRequest.requestActive();
  });

  function removeDisplayRequest() {
    if (displayRequest) {
      displayRequest.requestRelease();
    }
  }

  Observer.subscribe('Timer.cancel', removeDisplayRequest);
  Observer.subscribe('Timer.breakOver', removeDisplayRequest);

})();