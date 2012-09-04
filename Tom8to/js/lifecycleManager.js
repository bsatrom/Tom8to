(function () {
  var app = WinJS.Application;
  var webApp = Windows.UI.WebUI.WebUIApplication;

  function timeToSeconds(timeString) {
    if (typeof timeString === "string") {  
      var timeComponents = timeString.split(":");
      return (parseInt(timeComponents[0]) * 60) + parseInt(timeComponents[1]);
    } else {
      return 0;
    }
  }

  function appResume() {
    var state = WinJS.Application.sessionState;
    if (Countdown.started() || state["timeRemaining"]) {
      var timeRemaining = state["timeRemaining"];
      var onBreak = state["onBreak"];

      var diffSeconds = Math.floor((Date.now() - state["checkpointTime"]) / 1000);

      Countdown.initialize(timeRemaining);
      var remainingSeconds = parseInt(timeToSeconds(timeRemaining));
      
      /* See how much time has passed since the app was suspended. If the difference is greater than the time remaining, 
       * check to see if the suspention happened during a break. If so, reset to initial app state.
       * If the suspention didn't occur during a break, add the break-time to the remaining time and check again to see if the 
       * elapsed time is greater than the time remaining.s
       */
      if (diffSeconds > remainingSeconds) {
        if (!onBreak) {
          remainingSeconds += Countdown.breakDuration() * 60;

          if (diffSeconds > remainingSeconds) {
            Tom8to.resetToStart();
          } else {
            Countdown.setBreak(true);

            restartCountdown(remainingSeconds, diffSeconds);

            WinJS.Utilities.addClass(timer, 'breakText');
          }
        } else {
          Tom8to.resetToStart();
        }
      } else {
        restartCountdown(remainingSeconds, diffSeconds);
      }
    }
  }

  function restartCountdown(remainingSeconds, diffSeconds) {
    var timeLeft = remainingSeconds - diffSeconds;
    var minutes = Math.floor(timeLeft / 60);
    var seconds = timeLeft - (minutes * 60);

    Countdown.initialize(minutes, seconds);
    timer.innerText = Countdown.time();

    Tom8to.startCountdown();
  }

  app.addEventListener('checkpoint', function (eventObject) {
    if (Countdown.started()) {
      var state = WinJS.Application.sessionState;
      state["timeRemaining"] = Countdown.time();
      state["onBreak"] = Countdown.getBreak();
      state["checkpointTime"] = Date.now();

      if (!Countdown.paused()) {
          Observer.publish("Toast.add", timeToSeconds(Countdown.time()));
      }
    }
  });

  webApp.addEventListener("suspending", function () {
    Countdown.suspend();
  });

  webApp.addEventListener("resuming", function () {
    if (!Countdown.paused()) {
      appResume();
    }
  });

  WinJS.Namespace.define('LifecycleManager', {
    resume: appResume
  });
})();