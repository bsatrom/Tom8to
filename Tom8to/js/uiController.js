(function () {
	'use strict';
	
	var utils = WinJS.Utilities;
	var animation = WinJS.UI.Animation;

	function onPointerDown(evt) {
		animation.pointerDown(evt.srcElement);
	}

	function onPointerUp(evt) {
		animation.pointerUp(evt.srcElement);
	}

	WinJS.Namespace.define("UIController", {
		transition: function (incoming, outgoing) {
			animation.crossFade(incoming, outgoing).done(function () {
				outgoing.setAttribute('disabled', '');
				utils.addClass(outgoing, "hidden");

				incoming.removeAttribute('disabled');
				utils.removeClass(incoming, "hidden");
			});
		},
		initButtons: function (buttons) {
			for (var i = 0, len = buttons.length; i < len; i++ ) { 
				buttons[i].addEventListener("MSPointerDown", onPointerDown, false);
				buttons[i].addEventListener("MSPointerUp", onPointerUp, false);
			}
		}
	});
})();