 (function () {
  'use strict';

  var app = Windows.UI.WebUI.WebUIApplication,
      displayRequest = new Windows.System.Display.DisplayRequest(),
      requestCounter = 0;

  Observer.subscribe('Timer.start', function () {
    if (requestCounter === 0) {
      displayRequest.requestActive();
      requestCounter++;
    }
  });

  function removeDisplayRequest() {
    if (displayRequest) {
      displayRequest.requestRelease();
      requestCounter--;
    }
  }

  Observer.subscribe('Timer.cancel', removeDisplayRequest);
  Observer.subscribe('Timer.breakOver', removeDisplayRequest);

  app.addEventListener('suspending', function () {
    var state = WinJS.Application.sessionState;
    
    removeDisplayRequest();
    state["requestCounter"] = requestCounter;
  });

  app.addEventListener('resuming', function () {
    var state = WinJS.Application.sessionState;
    requestCounter = state["requestCounter"];

    if (requestCounter === 0 && !Countdown.paused()) {
      displayRequest.requestActive();
      requestCounter++;
    }
  });

})();