(function() {
    var el;

    Observer.subscribe('Timer.start', function () {
        WinJS.UI.Animation.fadeOut(el);
    });

    Observer.subscribe('Timer.end', function () {
        WinJS.UI.Animation.fadeIn(el);
    });

    var init = function (adElement) {
        if (!adElement) {
            throw "Please provide an element for the ad control.";
        }

        el = document.getElementById(adElement);
        backupEl = document.getElementById("backupAd");

        var adsSdk = new MicrosoftNSJS.Advertising.AdControl(el, {
            //applicationId: "a0ac85c7-c493-4006-a9f2-d598d3e3dfcf",
            //adUnitId: "10042356",
            applicationId: 'test_client', 
            adUnitId: 'ImageText_320x50',
            isAutoRefreshEnabled: false
        });

        adsSdk.refresh();

        adsSdk.onErrorOccurred = function (elem, err) {
            console.log("Ad error: " + err.errorMessage);
        }
    }

    WinJS.Namespace.define("ADS", {
        init: init
    });
})();