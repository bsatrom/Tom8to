(function () {
	'use strict';
	
	function shareDataEventHandler(request) {
		request.data.properties.title = "Share Tom8to!";
		request.data.properties.description = "Tell your friends about Tom8to";
		request.data.setText("I'm Getting Things Done on Windows 8 with the Tom8to application! http://www.tom8tob.com");
	}

	WinJS.Namespace.define("Share", {
		initialize: function () {
			var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();

			dataTransferManager.addEventListener("datarequested", function (e) {
				var request = e.request;
				shareDataEventHandler(request);
			});
		}
	});

})();