(function () {
  var toast, toastNotifier, toastXml;
  var tile, tileNotifier, tileXml;

  function initToast() {
    var toastTextElements, audio;
    var template = Windows.UI.Notifications.ToastTemplateType.toastText02;
    toastXml = Windows.UI.Notifications.ToastNotificationManager.getTemplateContent(template);

    toastTextElements = toastXml.getElementsByTagName("text");
    toastTextElements[0].appendChild(toastXml.createTextNode("A full Pomodoro!"));
    toastTextElements[1].appendChild(toastXml.createTextNode("Great work! Ready for another?"));

    audio = toastXml.createElement("audio");
    audio.setAttribute("src", "ms-winsoundevent:Notification.Looping.Alarm");
    audio.setAttribute("loop", "true");

    toastXml.selectSingleNode("/toast").appendChild(audio);
    toastXml.selectSingleNode("/toast").setAttribute("duration", "long");
    toastXml.selectSingleNode("/toast").setAttribute("launch", "toast");

    toastNotifier = Windows.UI.Notifications.ToastNotificationManager.createToastNotifier();
  }

  function initTile() {
    var template = Windows.UI.Notifications.TileTemplateType.tileWideText01;
    tileXml = Windows.UI.Notifications.TileUpdateManager.getTemplateContent(template);

    var tileTextAttributes = tileXml.getElementsByTagName("text");
    tileTextAttributes[0].appendChild(tileXml.createTextNode("A Full Pomodoro!"));
    tileTextAttributes[1].appendChild(tileXml.createTextNode("Great work! Ready for another?"));
    
    var squareTileXml = Windows.UI.Notifications.TileUpdateManager.getTemplateContent(Windows.UI.Notifications.TileTemplateType.tileSquareText01);
    var squareTileImageAttributes = squareTileXml.getElementsByTagName("text");
    squareTileImageAttributes[0].appendChild(squareTileXml.createTextNode("Done!"));
    squareTileImageAttributes[1].appendChild(squareTileXml.createTextNode("How about"));
    squareTileImageAttributes[2].appendChild(squareTileXml.createTextNode("another?"));

    var node = tileXml.importNode(squareTileXml.getElementsByTagName("binding").item(0), true);
    tileXml.getElementsByTagName("visual").item(0).appendChild(node);

    tileNotifier = Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication();
  }

  function scheduleTileUpdate(topics, timeRemaining) {
    if (tileNotifier.setting === Windows.UI.Notifications.NotificationSetting.enabled) {
      removeTileUpdates();

      var scheduledToast = new Windows.UI.Notifications.ScheduledTileNotification(toastXml, startTime);
    }
  }

  function scheduleNotifications(topics, timeRemaining) {
    if (toastNotifier.setting === Windows.UI.Notifications.NotificationSetting.enabled) {
      removeToasts();
      removeTileUpdates();

      var noticeTime = new Date();
      noticeTime.setSeconds(noticeTime.getSeconds() + parseInt(timeRemaining) + 1);

      //Schedule Toast
      toast = new Windows.UI.Notifications.ScheduledToastNotification(toastXml, noticeTime);
      toast.id = "Tom8to_Toast";
      toastNotifier.addToSchedule(toast);

      //Schedule Tile Update
      tile = new Windows.UI.Notifications.ScheduledTileNotification(tileXml, noticeTime);
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
  
  initToast();
  initTile();
})();