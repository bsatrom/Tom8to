(function () {
    "use strict";

    var play, pause, reset, playSmall, hidden, timer, pauseContainer, playContainer;
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
    }

    app.onactivated = function (eventObject) {    	
    	populateDOMVariables();

    	if (eventObject.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.launch) {
    		if (eventObject.detail.previousExecutionState !== Windows.ApplicationModel.Activation.ApplicationExecutionState.terminated) {

    			UIController.initButtons(document.querySelectorAll("[class^='icon-']"));

    			Observer.subscribe('tick', function (topics, data) {
    				timer.innerText = data;
					});

    			Observer.subscribe('init', function (topics, data) {
    				timer.innerText = data;
					});

    			play.addEventListener('click', function () {
    				UIController.transition(hidden, play);
    				Countdown.start();
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
    		}

    		Countdown.initialize();
    		timer.innerText = Coundown.time();
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
