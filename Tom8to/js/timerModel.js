(function () {
	'use strict';

	// Timing "Constants"
	var WORK_MINUTES = 25;
	var BREAK_MINUTES = 5;
	var TIMEOUT = 1000;
	
	var _timer, _min;
	var _sec = 0;

	var timerEvents = {
		init: function () {
			Observer.publish('Timer.init', _getTime());
		},
		start: function () {
			Observer.publish('Timer.start');
		},
		tick: function () {
			Observer.publish('Timer.tick', _getTime());
		},
		breakTime: function () {
			Observer.publish('Timer.break', BREAK_MINUTES);
		},
		end: function () {
			Observer.publish('Timer.end');
		}
	};

	function _getTime() {
		if (_sec <= 9 && _sec !== "00") {
			_sec = "0" + _sec;
		}
		return (_min <= 9 ? "0" + _min : _min) + ":" + _sec;
	};

	function _countDown() {
		_sec--;
		if (_sec === -1) {
			if (_min === 0) { 
				_sec = 0;

				//Handle break here? or via a callback
				timerEvents.end();
			} else {
				_sec = 59;
				_min = _min - 1;
			}
		}

		timerEvents.tick();
	};
	
	WinJS.Namespace.define("Countdown", {
		initialize: function (time) {
			var timeComponents;

			_min = time || WORK_MINUTES;
			_sec = 0;

			if (time) {
				timeComponents = time.toString().split(':');			
				if (timeComponents.length > 1) {
					try {
						_min = parseInt(timeComponents[0]);
						_sec = parseInt(timeComponents[1]);
					} catch (e) {
						_min = WORK_MINUTES;
						_sec = 0;
					}
				}
			}

			timerEvents.init();
		},
		time: function () { return _getTime() },
		start: function () {
			if (!_min) {
				this.initialize();
			}
			_timer = setInterval(_countDown, TIMEOUT);

			timerEvents.start();
		},
		stop: function () {
			if (_timer) {
				clearInterval(_timer);
			}
		},
		reset: function () {
			this.stop();
			
			this.initialize();
			this.start();
		}
	});
		
})();