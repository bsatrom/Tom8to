(function () {
    "use strict";

    var timerDuration;
    var play, pause, reset, playSmall, hidden, timer, appBar, barReset, barCancel,
				pauseContainer, playContainer, alarm, changeDuration, resetDuration, MediaControls;
    
    var canToggleAlarm = false;
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

    	changeDuration = document.querySelector('#timerDuration');
    	resetDuration = document.querySelector('#resetDuration');

    	alarm = document.querySelector('#alarm');    				
    }
	
    function applySettings() {
    	if (!container.values["alarmSound"]) {
    		container.values["alarmSound"] = "alarmRing";
		}

    	if (!container.values["alarmFont"]) {
    		container.values["alarmFont"] = "segoeUI";
			}

    	if (!container.values["timerDuration"]) {
    		container.values["timerDuration"] = 25;
    	}

    	timerDuration = container.values["timerDuration"];
    	changeDuration.value = timerDuration;

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
    	UIController.transition(play, hidden).then(function () {
    		UIController.transition(pauseContainer, playContainer).done(function () {
    			Countdown.stop();
    			Countdown.initialize(timerDuration);
    		});
    	});
    }

    function createTimerSubscriptions() {
    	Observer.subscribe('Timer.tick', function (topics, data) {
    		timer.innerText = data;
    	});

    	Observer.subscribe('Timer.init', function (topics, data) {
    		timer.innerText = data;
    	});

    	Observer.subscribe('Timer.end', function () {
    		if (alarm.src) {
    			canToggleAlarm = true;
    			alarm.play();
    		}
					
    		// triggers pulse animation
    		WinJS.Utilities.addClass(timer, 'pulse');
    		
    		setTimeout(function () {
					WinJS.Utilities.removeClass(timer, 'pulse');
    			resetToStart();
    			toggleAppBarButtons();
    		}, 10000);
    	});
    }

    function startCountdown() {
    	UIController.transition(hidden, play);
    	Countdown.start();
    	toggleAppBarButtons();
    }

    function createSettingsSubscriptions() {
    	Observer.subscribe('Settings.AlarmChange', function () {
    		alarm.src = "audio/" + container.values["alarmSound"] + ".mp3";
    	});

    	Observer.subscribe('Settings.FontChange', function () {
    		timer.className = container.values["alarmFont"];
    	});
    }

    function setTimerDuration(duration) {
    	container.values["timerDuration"] = duration;
    	timerDuration = duration;

    	Countdown.initialize(container.values["timerDuration"]);

    	//Access the Countdown object to get the formatted time value
    	timer.innerText = Countdown.time();
		}

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
    	MediaControls = Windows.Media.MediaControl;

    	// Add event listeners for the buttons
    	MediaControls.addEventListener('playpressed', playAlarm);
    	MediaControls.addEventListener('pausepressed', pauseAlarm);
    	MediaControls.addEventListener('playpausetogglepressed', playpauseAlarm);
    	MediaControls.addEventListener('stoppressed', stopAlarm);

    	alarm.addEventListener('playing', function () {
    		MediaControls.isPlaying = true;
			});

    	alarm.addEventListener('pause', function () {
    		MediaControls.isPlaying = false;
    	});

    	alarm.addEventListener('ended', function () {
    		MediaControls.artistName = "Tom8to";
    		MediaControls.trackName = "Your Time is Up!";
    		MediaControls.isPlaying = false;

    		MediaControls.removeEventListener('playpressed', playAlarm);
    		MediaControls.removeEventListener('pausepressed', pauseAlarm);
    		MediaControls.removeEventListener('playpausetogglepressed', playpauseAlarm);
    	});

    	alarm.src = "audio/" + container.values["alarmSound"] + ".mp3";

    	MediaControls.isPlaying = false;
    }

    app.addEventListener('activated', function (eventObject) {    	
    	populateDOMVariables();

    	applySettings();

    	UIController.initButtons(document.querySelectorAll("[class^='icon-']"));

    	createTimerSubscriptions();
    	createSettingsSubscriptions();

    	play.addEventListener('click', function () {
    		stopAlarm(); //if a previous alarm is still playing, pause it
    		startCountdown();
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
    		stopAlarm(); //if a previous alarm is still playing, pause it

    		if (pauseContainer.className === 'hidden') {
    			UIController.transition(pauseContainer, playContainer);
				}

	    	Countdown.reset(container.values["timerDuration"]);
    	});

    	barReset.addEventListener('click', function () {
    		appBar.winControl.hide();
    		stopAlarm(); //if a previous alarm is still playing, pause it

    		Countdown.reset(container.values["timerDuration"]);
    	});

    	barCancel.addEventListener('click', function () {
    		appBar.winControl.hide();
    		stopAlarm(); //if a previous alarm is still playing, pause it

    		resetToStart();
    		toggleAppBarButtons();
    	});

    	changeDuration.addEventListener('change', function () {
    		setTimerDuration(changeDuration.value);

    		changeDuration.parentElement.winControl.hide();
    	});

    	resetDuration.addEventListener('click', function () {
    		setTimerDuration('25');

    		changeDuration.value = 25;
    		resetDuration.parentElement.winControl.hide();
    	});

    	WinJS.UI.processAll();

    	if (eventObject.detail.previousExecutionState !== Windows.ApplicationModel.Activation.ApplicationExecutionState.terminated) {
    		Countdown.initialize(timerDuration);
    		timer.innerText = Countdown.time();

    		Share.initialize();    		
    	} else {
    		if (WinJS.Application.sessionState["timeRemaining"]) {

    			Countdown.initialize(WinJS.Application.sessionState["timeRemaining"]);
    			timer.innerText = Countdown.time();

    			startCountdown();
				} else {
					Countdown.initialize(timerDuration);
					timer.innerText = Countdown.time();
				}
			}

    	setupBackgroundAudio();
		});

    WinJS.Application.addEventListener('settings', function (e) {
    	e.detail.applicationcommands = {
    		"helpDiv": { title: "Help", href: "/html/helpFlyout.html" },
    		"settingsDiv": { title: "Settings", href: "/html/settingsFlyout.html" }
    	};
    	WinJS.UI.SettingsFlyout.populateSettings(e);
    });

		app.addEventListener('checkpoint', function(eventObject) {
    	WinJS.Application.sessionState["timeRemaining"] = Countdown.time();
		});

		Windows.UI.WebUI.WebUIApplication.addEventListener("suspending", function () {
			Countdown.stop();
		});

		Windows.UI.WebUI.WebUIApplication.addEventListener("resuming", function () {
			if (WinJS.Application.sessionState["timeRemaining"]) {
				Countdown.initialize(WinJS.Application.sessionState["timeRemaining"]);
				timer.innerText = Countdown.time();

				startCountdown();
			}
		});

    app.start();
})();