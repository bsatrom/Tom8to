(function () {
  'use strict';
  
  var toastNotifier, tileNotifier;
  var breakToastXml, doneToastXml;
  var breakTileXml, doneTileXml;
  var breakNoticeText, doneNoticeText;

  function initToast(noticeText) {
    var toastTextElements, audio, toastXml;
    var template = Windows.UI.Notifications.ToastTemplateType.toastText02;
    toastXml = Windows.UI.Notifications.ToastNotificationManager.getTemplateContent(template);

    toastTextElements = toastXml.getElementsByTagName("text");
    toastTextElements[0].appendChild(toastXml.createTextNode(noticeText.toast.primary));
    toastTextElements[1].appendChild(toastXml.createTextNode(noticeText.toast.secondary));

    audio = toastXml.createElement("audio");
    audio.setAttribute("src", "ms-winsoundevent:Notification.Looping.Alarm");
    audio.setAttribute("loop", "true");

    toastXml.selectSingleNode("/toast").appendChild(audio);
    toastXml.selectSingleNode("/toast").setAttribute("duration", "long");
    toastXml.selectSingleNode("/toast").setAttribute("launch", "toast");

    return toastXml;
  }

  function initTile(noticeText) {
    var tileXml;

    var template = Windows.UI.Notifications.TileTemplateType.tileWideText01;
    tileXml = Windows.UI.Notifications.TileUpdateManager.getTemplateContent(template);

    var tileTextAttributes = tileXml.getElementsByTagName("text");
    tileTextAttributes[0].appendChild(tileXml.createTextNode(noticeText.largeTile.primary));
    tileTextAttributes[1].appendChild(tileXml.createTextNode(noticeText.largeTile.secondary));
    
    var squareTileXml = Windows.UI.Notifications.TileUpdateManager.getTemplateContent(Windows.UI.Notifications.TileTemplateType.tileSquareText01);
    var squareTileImageAttributes = squareTileXml.getElementsByTagName("text");
    squareTileImageAttributes[0].appendChild(squareTileXml.createTextNode(noticeText.smallTile.primary));
    squareTileImageAttributes[1].appendChild(squareTileXml.createTextNode(noticeText.smallTile.secondary));
    squareTileImageAttributes[2].appendChild(squareTileXml.createTextNode(noticeText.smallTile.tertiary));

    var node = tileXml.importNode(squareTileXml.getElementsByTagName("binding").item(0), true);
    tileXml.getElementsByTagName("visual").item(0).appendChild(node);

    return tileXml;
  }

  function scheduleTileUpdate(topics, timeRemaining) {
    if (tileNotifier.setting === Windows.UI.Notifications.NotificationSetting.enabled) {
      removeTileUpdates();

      var scheduledToast = new Windows.UI.Notifications.ScheduledTileNotification(toastXml, startTime);
    }
  }

  function scheduleNotifications(topics, timeRemaining) {
    var toast, tile;

    if (toastNotifier.setting === Windows.UI.Notifications.NotificationSetting.enabled) {
      removeToasts();
      removeTileUpdates();

      var noticeTime = new Date();
      noticeTime.setSeconds(noticeTime.getSeconds() + parseInt(timeRemaining) + 1);

      if (!Countdown.getBreak()) {
        //Schedule Break Toast
        toast = new Windows.UI.Notifications.ScheduledToastNotification(breakToastXml, noticeTime);
        toast.id = "Tom8to_Toast";
        toastNotifier.addToSchedule(toast);

        //Schedule Break Tile Update
        tile = new Windows.UI.Notifications.ScheduledTileNotification(breakTileXml, noticeTime);
        tile.expirationTime = new Date(noticeTime.setMinutes(noticeTime.getMinutes() + 1));
        tileNotifier.addToSchedule(tile);

        noticeTime.setSeconds(noticeTime.getSeconds() + Countdown.breakDuration() * 60);
      }

      //Schedule Done Toast
      toast = new Windows.UI.Notifications.ScheduledToastNotification(doneToastXml, noticeTime);
      toast.id = "Tom8to_Toast";
      toastNotifier.addToSchedule(toast);

      //Schedule Done Tile Update
      tile = new Windows.UI.Notifications.ScheduledTileNotification(doneTileXml, noticeTime);
      tile.expirationTime = new Date(noticeTime.setMinutes(noticeTime.getMinutes() + 1));
      tileNotifier.addToSchedule(tile);
    }
  }

  function removeToasts() {
    var toasts = toastNotifier.getScheduledToastNotifications();

    toasts.forEach(function (toast) {
      toastNotifier.removeFromSchedule(toast);
    });
  }

  function removeTileUpdates() {
    tileNotifier.clear();
  }

  function clearAll() {
    removeToasts();
    removeTileUpdates();
  }

  Observer.subscribe('Toast.add', scheduleNotifications);

  Observer.subscribe('Timer.end', clearAll);
  Observer.subscribe('Toast.remove', removeToasts);
  Observer.subscribe('Notifications.remove', clearAll);
  
  breakNoticeText = {
      toast: {
          primary: "Break Time!",
          secondary: "Go nuts, you've earned it!"
      },
      largeTile: {
          primary: "Break Time!",
          secondary: "Go nuts, you've earned it!"
      },
      smallTile: {
          primary: "Done!",
          secondary: "Time for a",
          tertiary: "Break!"
      }
  };

  doneNoticeText = {
      toast: {
          primary: "Time's up!",
          secondary: "Ready for another Pomodoro?"
      },
      largeTile: {
          primary: "Time's up!",
          secondary: "Ready for another Pomodoro?"
      },
      smallTile: {
          primary: "Done!",
          secondary: "How about",
          tertiary: "another?"
      }
  };

  toastNotifier = Windows.UI.Notifications.ToastNotificationManager.createToastNotifier();
  tileNotifier = Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication();

  doneToastXml = initToast(doneNoticeText);
  doneTileXml = initTile(doneNoticeText);
  breakToastXml = initToast(breakNoticeText);
  breakTileXml = initTile(breakNoticeText);
})();