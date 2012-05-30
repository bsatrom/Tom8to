﻿(function () {
	'use strict';

	// Timing "Constants"
	var WORK_MINUTES = 25;
	var BREAK_MINUTES = 5;
	var TIMEOUT = 1000;
	
	var _timer, _min, _textClass;
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
			} else {
				_sec = 59;
				_min = _min - 1;
			}
		}

		timerEvents.tick();
	};
	
	WinJS.Namespace.define("Countdown", {
		initialize: function (minutes, textClass) {
			_sec = 0;
			_min = minutes || WORK_MINUTES;
			_textClass = textClass || "segoe";

			timerEvents.init();
		},
		time: function () { return _getTime() },
		textClass: _textClass,
		start: function () {
			if (!_min || !_textClass) {
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