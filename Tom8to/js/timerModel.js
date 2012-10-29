(function () {
	'use strict';

	// Timing "Constants"
	var WORK_MINUTES = 25;
	var BREAK_MINUTES = 5;
	var TIMEOUT = 1000;
	
	var _timer, _min, _sec;
	var _started = false;
	var _paused = false;
	var _break = false;

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
		cancel: function () {
		    Observer.publish('Timer.cancel');
		},
		end: function () {
			Observer.publish('Timer.end');
		},
		breakOver: function () {
		  Observer.publish('Timer.breakOver');
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

				clearInterval(_timer);

				if (!_break) {
				   timerEvents.end();
				    
				    setTimeout(function () {
				        _break = true;

				        Countdown.initialize(BREAK_MINUTES);
				        _timer = setInterval(_countDown, TIMEOUT);
				        timerEvents.breakTime();
				    }, 8000);
				} else {
				    _break = false;

				    timerEvents.breakOver();
				}
			} else {
				_sec = 59;
				_min = _min - 1;
			}
		}

		timerEvents.tick();
	};
	
	WinJS.Namespace.define("Countdown", {
	  started: function () {
	    return _started;
	  },
	  paused: function () {
	    return _paused;
	  },
	  setBreak: function (breakVal) {
	    _break = breakVal;
	  },
	  getBreak: function () {
	    return _break;
	  },
	  breakDuration: function () {
	    return BREAK_MINUTES;
	  },
	  initialize: function () {
	    var timeComponents, time, min, sec;
	    
	    if (arguments.length < 2) {
	      time = arguments[0];

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
	    } else {
	      _min = arguments[0];
	      _sec = arguments[1];
	    }

			timerEvents.init();
		},
		time: function () { return _getTime() },
		start: function () {
			if (!_min && !_sec) {
				this.initialize();
			}
			_timer = setInterval(_countDown, TIMEOUT);
			_started = true;
			_paused = false;

			timerEvents.start();
		},
		suspend: function () {
		    if (_timer) {
		        clearInterval(_timer);
		    }
		},
		stop: function () {
			if (_timer) {
				clearInterval(_timer);
			}

			_paused = true;
		},
		cancel: function () {
	        if (_timer) {
	            clearInterval(_timer);
	        }

	        _paused = true;

	        timerEvents.cancel();
	    },
		reset: function (time) {
			this.suspend();
			_break = false;

			this.initialize(time);
			this.start();
		}
	});
		
})();