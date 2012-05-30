(function () {
    "use strict";

    var play, pause, reset, playSmall, hidden, timer, appBar, barReset,
				barCancel, pauseContainer, playContainer, alarm;
    var app = WinJS.Application;
    var appData = Windows.Storage.ApplicationData.current;
    var container = appData.roamingSettings.createContainer("Tom8toSettings", Windows.Storage.ApplicationDataCreateDisposition.always);

    function populateDOMVariables() {
    	play = document.querySelector('#play');
    	pause = document.querySelector('#pause');
    	pauseContainer = document.querySelector('#pauseContainer');
    	playSmall = document.querySelector('#playSmall');
    	playContainer = document.querySelector('#playContainer');
    	reset = document.querySelector('#reset');

    	hidden = document.querySelector('.hidden');
    	timer = document.querySelector('#timer');

    	appBar = document.getElementById('appBar');
    	barReset = document.querySelector('#barReset');
    	barCancel = document.querySelector('#barCancel');

    	alarm = document.querySelector('#alarm');    				
    }

    function applySettings() {
    	if (!container.values["alarmSound"]) {
    		container.values["alarmSound"] = "alarmRing";
			}

    	if (!container.values["alarmFont"]) {
    		container.values["alarmFont"] = "segoeUI";
    	}

    	alarm.src = "audio/" + container.values["alarmSound"] + ".mp3";
    	timer.className = container.values["alarmFont"];
    }

    function toggleAppBarButtons() {
    	var appBarButtons = document.querySelectorAll('button[data-win-control="WinJS.UI.AppBarCommand"]');

    	for (var i = 0, len = appBarButtons.length; i < len; i++) {
    		if (appBarButtons[i].getAttribute('disabled') === '') {
    			appBarButtons[i].removeAttribute('disabled');
    		} else {
    			appBarButtons[i].setAttribute('disabled', '');
    		}
    	}
    }

    function resetToStart() {
    	UIController.transition(pauseContainer, playContainer);
    	UIController.transition(play, hidden);

    	Countdown.stop();
    	Countdown.initialize();
    }

    function timerSubscriptions() {
    	Observer.subscribe('Timer.tick', function (topics, data) {
    		timer.innerText = data;
    	});

    	Observer.subscribe('Timer.init', function (topics, data) {
    		timer.innerText = data;
    	});

    	Observer.subscribe('Timer.end', function () {
    		alarm.play();

    		// Flash 00:00 for 10 sec

    		resetToStart();
    	});
    }

    function settingsSubscriptions() {
    	Observer.subscribe('Settings.AlarmChange', function () {
    		alarm.src = "audio/" + container.values["alarmSound"] + ".mp3";
    	});

    	Observer.subscribe('Settings.FontChange', function () {
    		timer.className = container.values["alarmFont"];
    	});
    }

    app.onactivated = function (eventObject) {    	
    	populateDOMVariables();
    	applySettings();

    	UIController.initButtons(document.querySelectorAll("[class^='icon-']"));
			
    	timerSubscriptions();
    	settingsSubscriptions();

    	play.addEventListener('click', function () {
    		UIController.transition(hidden, play);
    		Countdown.start();
    		toggleAppBarButtons();
			});

    	pause.addEventListener('click', function () {
    		UIController.transition(playContainer, pauseContainer);
    		Countdown.stop();
			});

    	playSmall.addEventListener('click', function () {
    		UIController.transition(pauseContainer, playContainer);
    		Countdown.start();
    	});

    	reset.addEventListener('click', function () {
    		Countdown.reset();
			});

    	barReset.addEventListener('click', function () {
				appBar.winControl.hide();
    		Countdown.reset();
			});

    	barCancel.addEventListener('click', function () {
    		appBar.winControl.hide();

    		resetToStart();
    		toggleAppBarButtons();
			});
			
    	Countdown.initialize();
    	timer.innerText = Countdown.time();
			Share.initialize();

			WinJS.UI.processAll();
    };

    app.oncheckpoint = function (eventObject) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the 
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // eventObject.setPromise(). 
    };
	  
    WinJS.Application.onsettings = function (e) {
    	e.detail.applicationcommands = { "helpDiv": { title: "Help", href: "/html/helpFlyout.html" }, 
    		"settingsDiv": { title: "Settings", href: "/html/settingsFlyout.html" } };
    	WinJS.UI.SettingsFlyout.populateSettings(e);
    };

    app.start();
})();
