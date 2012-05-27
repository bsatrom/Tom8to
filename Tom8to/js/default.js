(function () {
    "use strict";

    var play, pause, reset, playMed, hidden, timer;
    var app = WinJS.Application;
    
    app.onactivated = function (eventObject) {
    	play = document.querySelector('#play');
    	hidden = document.querySelector('.hidden');
    	timer = document.querySelector('#timer');

    	if (eventObject.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.launch) {
    		if (eventObject.detail.previousExecutionState !== Windows.ApplicationModel.Activation.ApplicationExecutionState.terminated) {

    			UIController.initButtons(document.querySelectorAll("[class^='icon-']"));

    			Observer.subscribe('tick', function (topics, data) {
    				timer.innerText = data;
					});

    			play.addEventListener('click', function () {
    				UIController.transition(hidden, play);
    				Countdown.start();
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
