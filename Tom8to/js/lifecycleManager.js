(function () {
  var app = WinJS.Application;
  var webApp = Windows.UI.WebUI.WebUIApplication;

  function timeToSeconds(timeString) {
    if (typeof timeString === "string") {  
      var timeComponents = timeString.split(":");
      return (timeComponents[0]*60) + timeComponents[1];
    } else {
      return 0;
    }
  }

  function appResume() {
    var state = WinJS.Application.sessionState;
    if (Countdown.started() && state["timeRemaining"]) {
      var timeRemaining = state["timeRemaining"];
      var diffSeconds = Math.floor((Date.now() - state["checkpointTime"]) / 1000);

      Countdown.initialize(timeRemaining);
      var remainingSeconds = parseInt(timeToSeconds(timeRemaining));

      if (diffSeconds > remainingSeconds) {
        Tom8to.resetToStart();
      } else {
        var timeLeft = remainingSeconds - diffSeconds;
        var minutes = Math.floor(timeLeft / 60);
        var seconds = timeLeft - (minutes * 60);

        Countdown.initialize(minutes, seconds);
        timer.innerText = Countdown.time();

        Tom8to.startCountdown();
      }
    }
  }

  app.addEventListener('checkpoint', function (eventObject) {
    if (Countdown.started()) {
      var state = WinJS.Application.sessionState;
      state["timeRemaining"] = Countdown.time();
      state["checkpointTime"] = Date.now();

      Observer.publish("Toast.add", timeToSeconds(Countdown.time()));
    }
  });

  webApp.addEventListener("suspending", function () {
    Countdown.stop();
  });

  webApp.addEventListener("resuming", function () {
    appResume();
  });

  WinJS.Namespace.define('LifecycleManager', {
    resume: appResume
  });
})();