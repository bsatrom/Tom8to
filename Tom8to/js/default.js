(function () {
    "use strict";

    var play, pause, reset, playSmall, hidden, timer, appBar,
				barReset, barCancel, pauseContainer, playContainer;
    var app = WinJS.Application;
  
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

    app.onactivated = function (eventObject) {    	
    	populateDOMVariables();

    	if (eventObject.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.launch) {
    		if (eventObject.detail.previousExecutionState !== Windows.ApplicationModel.Activation.ApplicationExecutionState.terminated) {

    			UIController.initButtons(document.querySelectorAll("[class^='icon-']"));

    			Observer.subscribe('Timer.tick', function (topics, data) {
    				timer.innerText = data;
					});

    			Observer.subscribe('Timer.init', function (topics, data) {
    				timer.innerText = data;
					});

    			Observer.subscribe('Timer.end', function () {
    				var alarm = document.querySelector('#alarm');
    				alarm.play();

    				// Flash 00:00 for 10 sec

    				resetToStart();
    			});

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
    		}

    		Countdown.initialize();
    		timer.innerText = Countdown.time();
				Share.initialize();

				WinJS.UI.processAll();
    	}
    };

    app.oncheckpoint = function (eventObject) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the 
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // eventObject.setPromise(). 
    };
	  
    app.start();
})();
