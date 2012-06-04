(function () {
  var alarm, MediaControls;
  var canToggleAlarm = false;

  function playAlarm() {
    if (canToggleAlarm) {
      alarm.play();
    }
  }

  function pauseAlarm() {
    if (canToggleAlarm) {
      alarm.pause();
    }
  }

  function playpauseAlarm() {
    if (canToggleAlarm) {
      if (MediaControls.isPlaying) {
        alarm.pause();
      } else {
        alarm.play();
      }
    }
  }

  function stopAlarm() {
    if (canToggleAlarm) {
      alarm.pause();
    }
  }

  function setupBackgroundAudio() {
    var appData = Windows.Storage.ApplicationData.current;
    var container = appData.roamingSettings.createContainer("Tom8toSettings", Windows.Storage.ApplicationDataCreateDisposition.always);
    MediaControls = Windows.Media.MediaControl;
    alarm = document.getElementById('alarm');

    // Add event listeners for the buttons
    MediaControls.addEventListener('playpressed', playAlarm);
    MediaControls.addEventListener('pausepressed', pauseAlarm);
    MediaControls.addEventListener('playpausetogglepressed', playpauseAlarm);
    MediaControls.addEventListener('stoppressed', stopAlarm);
    MediaControls.artistName = "Tom8to";
    MediaControls.albumArt = new Windows.Foundation.Uri("ms-appx://images/logo.png");
        
    alarm.addEventListener('playing', function () {
      MediaControls.isPlaying = true;
    });

    alarm.addEventListener('pause', function () {
      MediaControls.isPlaying = false;
    });

    alarm.addEventListener('ended', function () {
      MediaControls.isPlaying = false;

      MediaControls.removeEventListener('playpressed', playAlarm);
      MediaControls.removeEventListener('pausepressed', pauseAlarm);
      MediaControls.removeEventListener('playpausetogglepressed', playpauseAlarm);
    });

    alarm.src = "audio/" + container.values["alarmSound"] + ".mp3";

    MediaControls.isPlaying = false;
  }

  Observer.subscribe("App.loaded", setupBackgroundAudio);

  Observer.subscribe('Timer.end', function () {
    canToggleAlarm = true;
  });
})();