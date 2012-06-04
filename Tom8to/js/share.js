(function () {
	'use strict';

	var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();

	function shareDataEventHandler(request) {
		request.data.properties.title = "Share Tom8to!";
		request.data.properties.description = "Tell your friends about Tom8to";
		request.data.setText("I'm Getting Things Done on Windows 8 with the Tom8to application! http://www.tom8to.com");
	}

	dataTransferManager.addEventListener("datarequested", function (e) {
	  var request = e.request;
	  shareDataEventHandler(request);
	});
})();